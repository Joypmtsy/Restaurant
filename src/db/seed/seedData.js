import { STables } from "./STables";
import { SCategories } from "./SCategories";
import { SMenus } from "./SMenus";
import { SMenuPrices } from "./SMenuPrices";
import { SBills } from "./SBills";
import { SOrderRounds } from "./SOrderRounds";
import { SOrderItems } from "./SOrderItems";
import { SPayments } from "./SPayments";
import { STableTransfers } from "./STableTransfers";

export async function seedData(db) {
  try{
    await db.withTransactionAsync(
      async () => {
        await STables(db);
        await SCategories(db);
        await SMenus(db);
        await SMenuPrices(db);

        await SBills(db);
        await SOrderRounds(db);
        await SOrderItems(db);
        await SPayments(db);
        await STableTransfers(db);
      }
    );
    return {
      ok: true,
      message: 'Seed Database D1-D9 สำเร็จ',
    };

  }catch (error) {
    console.error(
      'seedData failed:',
      error
    );

    return {
      ok: false,
      message: 'Seed Database ไม่สำเร็จ',
    };
  }
}