-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "lastCheckInEmailSentAt" TIMESTAMP(3),
ADD COLUMN     "milestone10EmailSentAt" TIMESTAMP(3),
ADD COLUMN     "milestone20EmailSentAt" TIMESTAMP(3),
ADD COLUMN     "milestone5EmailSentAt" TIMESTAMP(3),
ADD COLUMN     "repeatCustomerEmailSentAt" TIMESTAMP(3),
ADD COLUMN     "unsubscribedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "NewsletterSubscriber" ADD COLUMN     "unsubscribedAt" TIMESTAMP(3);
