import { useState } from "react"
import { ArrowDownIcon, ArrowUpIcon, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BankingApp() {
  const [userType, setUserType] = useState("assembler")

  // USD to KRW conversion rate
  const usdToKrwRate = 1350 // Example rate: 1 USD = 1,350 KRW

  // Mock data for balance and transactions
  const balances = {
    assembler: 5280.42,
    buyer: 12450.89,
    corporation: 87650.32,
  }

  const transactions = [
    { id: 1, date: "2025-04-06 09:32:15", name: "John Smith", amount: 1250.0, type: "deposit" },
    { id: 2, date: "2025-04-05 14:21:08", name: "ABC Suppliers", amount: -450.75, type: "withdrawal" },
    { id: 3, date: "2025-04-04 11:15:42", name: "Sarah Johnson", amount: 825.5, type: "deposit" },
    { id: 4, date: "2025-04-03 16:08:33", name: "Office Supplies Inc", amount: -128.99, type: "withdrawal" },
    { id: 5, date: "2025-04-02 10:45:21", name: "Tech Solutions", amount: -1500.0, type: "withdrawal" },
    { id: 6, date: "2025-04-01 08:30:17", name: "Robert Williams", amount: 3000.0, type: "deposit" },
  ]

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto py-8 px-4">
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-600 text-white">
            <CardTitle className="text-2xl">Banking Dashboard</CardTitle>
            <CardDescription className="text-blue-100">Manage your finances with ease</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* User Type Selection */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4 text-blue-800">Select User Type</h2>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant={userType === "assembler" ? "default" : "outline"}
                  onClick={() => setUserType("assembler")}
                  className={
                    userType === "assembler" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-300 text-blue-600"
                  }
                >
                  Assembler
                </Button>
                <Button
                  variant={userType === "buyer" ? "default" : "outline"}
                  onClick={() => setUserType("buyer")}
                  className={userType === "buyer" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-300 text-blue-600"}
                >
                  Buyer
                </Button>
                <Button
                  variant={userType === "corporation" ? "default" : "outline"}
                  onClick={() => setUserType("corporation")}
                  className={
                    userType === "corporation" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-300 text-blue-600"
                  }
                >
                  Corporation
                </Button>
              </div>
            </div>

            {/* Balance Display */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4 text-blue-800">Current Balance</h2>
              <div className="bg-white rounded-lg p-6 border border-blue-200 shadow-sm">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <DollarSign className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Available Balance</p>
                    <p className="text-3xl font-bold text-blue-800">
                      ₩{Math.round(balances[userType as keyof typeof balances] * usdToKrwRate).toLocaleString("ko-KR")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div>
              <h2 className="text-lg font-medium mb-4 text-blue-800">Transaction History</h2>
              <div className="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-blue-50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-800">Date & Time</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-800">Name</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-blue-800">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-100">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-blue-50">
                          <td className="px-4 py-3 text-sm text-gray-700">{transaction.date}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{transaction.name}</td>
                          <td className="px-4 py-3 text-sm text-right font-medium flex justify-end items-center">
                            {transaction.amount > 0 ? (
                              <>
                                <ArrowDownIcon className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-600">
                                  +₩{Math.round(Math.abs(transaction.amount) * usdToKrwRate).toLocaleString("ko-KR")}
                                </span>
                              </>
                            ) : (
                              <>
                                <ArrowUpIcon className="h-4 w-4 text-red-500 mr-1" />
                                <span className="text-red-600">
                                  -₩{Math.round(Math.abs(transaction.amount) * usdToKrwRate).toLocaleString("ko-KR")}
                                </span>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

