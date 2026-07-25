// apps/web/lib/commerce/components/WalletBalanceCard.tsx

import React from "react";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Wallet, WalletTransaction } from "../models/types";
import { WalletTransactionType } from "../models/enums";

interface WalletBalanceCardProps {
  wallet: Wallet | null;
  ledger: WalletTransaction[];
}

export default function WalletBalanceCard({ wallet, ledger }: WalletBalanceCardProps) {
  const balance = wallet ? wallet.balance : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 max-w-md">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
          <WalletIcon className="h-4 w-4 text-indigo-600" />
          <h4 className="uppercase tracking-wider">Patient Health Wallet</h4>
        </div>
        <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
          ₹{balance}
        </span>
      </div>

      <div className="space-y-2">
        <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ledger History</h5>
        {!ledger || ledger.length === 0 ? (
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-center text-xs text-muted-foreground">
            No wallet transactions recorded.
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {ledger.map((txn) => {
              const isCredit = txn.type !== WalletTransactionType.DEBIT;
              return (
                <div key={txn.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    {isCredit ? (
                      <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <ArrowUpRight className="h-3.5 w-3.5 text-rose-600" />
                    )}
                    <div>
                      <div className="font-semibold text-slate-900">{txn.notes}</div>
                      <div className="text-[10px] text-muted-foreground">{txn.type}</div>
                    </div>
                  </div>
                  <div className={`font-bold ${isCredit ? "text-emerald-700" : "text-slate-900"}`}>
                    {isCredit ? "+" : "-"}₹{txn.amount}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
