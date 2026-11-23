import type { PageTemplateMessages } from '../PageFrame.js';

/** 11.7: invoice strings of the page templates. */
export const invoiceMessages = {
  invoice: 'Invoice',
  receipt: 'Receipt',
  issued: 'Issued',
  due: 'Due',
  billedFrom: 'From',
  billedTo: 'Billed to',
  taxId: (id) => `Tax ID ${id}`,
  lineItems: 'Line items',
  itemDescription: 'Description',
  quantity: 'Qty',
  unitPrice: 'Unit price',
  amount: 'Amount',
  subtotal: 'Subtotal',
  discount: 'Discount',
  total: 'Total',
  notes: 'Notes',
  invoiceStatus: (s) => ({ draft: 'Draft', due: 'Due', paid: 'Paid', overdue: 'Overdue', void: 'Void' })[s],
} satisfies Partial<PageTemplateMessages>;
