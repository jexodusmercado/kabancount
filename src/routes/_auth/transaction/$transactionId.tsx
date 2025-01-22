import { formatCurrency } from '@/lib/number'
import { getTransactionByIDApi } from '@/services/transaction'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/transaction/$transactionId')({
  loader: ({ params, context }) => {
    context.queryClient.ensureQueryData(
      getTransactionByIDQueryOptions(params.transactionId),
    )
  },
  component: TransactionPage,
})

const getTransactionByIDQueryOptions = (transactionId: string) =>
  queryOptions({
    queryKey: ['transaction', transactionId],
    queryFn: () => getTransactionByIDApi(transactionId),
  })

function TransactionPage() {
  const params = Route.useParams()
  const transactionQuery = useSuspenseQuery(
    getTransactionByIDQueryOptions(params.transactionId),
  )

  if (transactionQuery.isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">
        Transaction {transactionQuery.data?.id}
      </h1>
      <div>
        <div>
          Total Amount:{' '}
          {formatCurrency(transactionQuery.data?.total_amount || 0)}
        </div>
        <div>Status: {transactionQuery.data?.status}</div>
        <div>
          Payment Method: {transactionQuery.data?.payment_method}
        </div>
        <div>Items:</div>
        <ul>
          {transactionQuery.data?.transaction_items
            ? transactionQuery.data?.transaction_items.map(
              (item) => (
                <li key={item.id}>
                  {item.product?.name}{' '}
                  {item.productVariant?.name} x{' '}
                  {item.quantity}{' '}
                  {formatCurrency(item.price)}
                </li>
              ),
            )
            : null}
        </ul>
      </div>
    </div>
  )
}
