/*
  Warnings:

  - You are about to drop the column `slug` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `specId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Spec` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Spec" DROP CONSTRAINT "Spec_productId_fkey";

-- DropIndex
DROP INDEX "Product_slug_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "slug",
DROP COLUMN "specId",
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- DropTable
DROP TABLE "Spec";
