'use client';
import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FileUp, Check, X } from "lucide-react";
import { confirmImport } from "@/services/productService";

type Row = { code: string; name: string; price: number; quantity: number; __row?: number; __errors?: string[] };

function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as ArrayBuffer);
    fr.onerror = reject;
    fr.readAsArrayBuffer(file);
  });
}

function validateRow(r: Partial<Row>): string[] {
  const errors: string[] = [];
  if (!r.code || String(r.code).trim().length === 0) errors.push("code: obrigatório");
  if (!r.name || String(r.name).trim().length === 0) errors.push("name: obrigatório");
  const price = Number(r.price);
  if (Number.isNaN(price) || price < 0) errors.push("price: inválido");
  const qty = Number(r.quantity);
  if (!Number.isInteger(qty) || qty < 0) errors.push("quantity: inválida");
  return errors;
}

interface Props { onImported: () => void; }

export default function DialogImportProducts({ onImported }: Props) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);

  const summary = useMemo(() => {
    const valid = rows.filter(r => !r.__errors?.length);
    const invalid = rows.length - valid.length;
    const totalQty = valid.reduce((a, b) => a + Number(b.quantity || 0), 0);
    return { total: rows.length, valid: valid.length, invalid, totalQty };
  }, [rows]);

  async function parseExcel(f: File) {
    if (!/\.(xlsx|xls)$/i.test(f.name)) {
      toast.error("Envie .xlsx ou .xls");
      return;
    }
    setBusy(true);
    try {
      const buf = await readFileAsArrayBuffer(f);
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<any>(ws, { defval: "", raw: true });

      const parsed: Row[] = json.map((j, idx) => {
        // cabeçalhos aceitos: code, name, price, quantity
        const row: Row = {
          code: String(j.code ?? j.CODIGO ?? j["código"] ?? j["Código"] ?? "").trim(),
          name: String(j.name ?? j.NOME ?? j["nome"] ?? j["Nome"] ?? "").trim(),
          price: Number(typeof j.price === "string" ? j.price.replace(",", ".") : j.price),
          quantity: Number(j.quantity),
          __row: idx + 2,
        };
        row.__errors = validateRow(row);
        return row;
      });

      setRows(parsed);
      if (parsed.length === 0) toast.error("Planilha vazia");
      else toast.success("Leitura concluída");
    } catch (e: any) {
      console.error(e);
      toast.error("Falha ao ler planilha");
      setRows([]);
    } finally {
      setBusy(false);
    }
  }

  async function handleConfirm() {
    const valid = rows.filter(r => !r.__errors?.length)
      .map(({ code, name, price, quantity }) => ({ code, name, price, quantity }));
    if (valid.length === 0) {
      toast.error("Nenhuma linha válida");
      return;
    }
    setBusy(true);
    try {
      const res = await confirmImport(valid);
      toast.success(`Importado. Inseridos: ${res.inserted ?? 0}. Atualizados: ${res.updated ?? 0}. Movimentos: ${res.stockMovements ?? 0}.`);
      setOpen(false);
      setFile(null);
      setRows([]);
      onImported();
    } catch (e: any) {
      toast.error(e?.message || "Erro ao confirmar");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg">
            <FileUp size={16} /> Importar planilha
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[860px]">
          <DialogHeader>
            <DialogTitle>Importar produtos</DialogTitle>
            <DialogDescription>Colunas: <b>code, name, price, quantity</b>. Você revisa antes de gravar.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Label className="w-40">Arquivo</Label>
              <Input type="file" accept=".xlsx,.xls" disabled={busy}
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setFile(f);
                  if (f) parseExcel(f);
                }} />
            </div>

            <div className="flex gap-3 text-sm">
              <Badge variant="outline">Total: {summary.total}</Badge>
              <Badge>Válidos: {summary.valid}</Badge>
              <Badge variant="destructive">Inválidos: {summary.invalid}</Badge>
              <Badge variant="outline">Qtd total entrada: {summary.totalQty}</Badge>
            </div>

            <div className="border rounded-md max-h-[360px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="text-right">Preço</TableHead>
                    <TableHead className="text-right">Qtd</TableHead>
                    <TableHead>Erros</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Selecione a planilha.</TableCell></TableRow>
                  )}
                  {rows.map((r, i) => (
                    <TableRow key={`${r.code}-${i}`} className={r.__errors?.length ? "bg-red-50" : ""}>
                      <TableCell>{r.__row}</TableCell>
                      <TableCell className="font-mono">{r.code}</TableCell>
                      <TableCell>{r.name}</TableCell>
                      <TableCell className="text-right">{Number(r.price ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
                      <TableCell className="text-right">{r.quantity}</TableCell>
                      <TableCell>
                        {r.__errors?.length
                          ? r.__errors.join(" | ")
                          : <span className="inline-flex items-center gap-1"><Check className="h-3 w-3" />OK</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button className="hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors duration-200 cursor-pointer" variant="ghost" onClick={() => setOpen(false)} disabled={busy}><X size={16} /> Cancelar</Button>
            <Button className="hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-200 cursor-pointer" variant="ghost" onClick={handleConfirm} disabled={busy || summary.valid === 0}><Check size={16} /> Confirmar importação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
