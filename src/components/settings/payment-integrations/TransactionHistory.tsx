
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  date: string;
  amount: string;
  status: 'successful' | 'pending' | 'failed';
  customer: string;
  paymentMethod: string;
}

const sampleTransactions: Transaction[] = [
  {
    id: 'tx_1234567890',
    date: '2025-05-01',
    amount: '$49.99',
    status: 'successful',
    customer: 'john.doe@example.com',
    paymentMethod: 'Visa •••• 4242',
  },
  {
    id: 'tx_0987654321',
    date: '2025-04-30',
    amount: '$29.99',
    status: 'successful',
    customer: 'jane.smith@example.com',
    paymentMethod: 'Mastercard •••• 5555',
  },
  {
    id: 'tx_1122334455',
    date: '2025-04-29',
    amount: '$19.99',
    status: 'failed',
    customer: 'alex.wong@example.com',
    paymentMethod: 'PayPal',
  },
];

const TransactionHistory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Recent Transactions</span>
          <Button variant="outline" size="sm">Export CSV</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.customer}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.paymentMethod}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.status === 'successful'
                        ? 'default'
                        : transaction.status === 'pending'
                        ? 'outline'
                        : 'destructive'
                    }
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {sampleTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No transactions found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
