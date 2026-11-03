import { ApiBook } from '../../books/models/book.model';

export interface PhysicalStock {
  total: number;
  available: number;
}

export interface PhysicalItem {
  _id: string;
  book_id: string;
  barcode: string;
  status: 'AVAILABLE' | 'LOANED' | 'LOST' | 'IN_REPAIR';
}

export interface InventoryRow extends ApiBook {
  digital: boolean;
  stock: PhysicalStock;
}

export interface Loan {
  _id: string;
  user_id: string;
  physical_item_id: string;
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
}

export interface AdminStats {
  overdueStudents: number;
  activeLoans: number;
  totalPhysicalCopies: number;
  totalPdfs: number;
}
