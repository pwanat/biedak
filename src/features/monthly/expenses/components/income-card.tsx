import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "@radix-ui/react-icons"
import { formatCurrency } from "~/utils/currency"

export function IncomeCard() {
  const monthlyIncome = 5000 // This will come from your state/store later

  return (
    <Card className="w-full min-w-[300px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Monthly Income</CardTitle>
        <Button variant="ghost" size="icon">
          <PlusIcon className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatCurrency(monthlyIncome * 100, 'PLN')}
        </div>
        <p className="text-xs text-muted-foreground">
          Available to spend this month
        </p>
      </CardContent>
    </Card>
  )
}