import type {
  BranchWithCards,
  VendorBranchRecord,
  VendorWithBranchesAndCards,
} from '@/types';

export type VendorBranchListItem = {
  id: string;
  vendorId: string;
  branchName: string;
  branchCode: string;
  location: string;
  vendorName: string;
  status: 'active' | 'inactive';
  cardCount: number;
  cards: BranchWithCards['cards'];
};

function isVendorWithBranches(
  item: unknown
): item is VendorWithBranchesAndCards {
  return (
    typeof item === 'object' &&
    item != null &&
    'branches_with_cards' in item &&
    Array.isArray((item as VendorWithBranchesAndCards).branches_with_cards)
  );
}

function isLegacyBranchRecord(item: unknown): item is VendorBranchRecord {
  return (
    typeof item === 'object' &&
    item != null &&
    'branch_name' in item &&
    ('id' in item || 'branch_id' in item)
  );
}

function branchStatusFromCards(
  cards: BranchWithCards['cards']
): 'active' | 'inactive' {
  if (!cards.length) return 'inactive';
  return cards.some((card) => card.card_status === 'active')
    ? 'active'
    : 'inactive';
}

function mapLegacyBranch(row: VendorBranchRecord): VendorBranchListItem {
  const status =
    row.status === 'approved' || row.status === 'active'
      ? 'active'
      : 'inactive';

  return {
    id: row.id,
    vendorId: row.vendor_id,
    branchName: row.branch_name,
    branchCode: row.branch_code || row.gvid || '-',
    location: row.branch_location || '-',
    vendorName: row.branch_manager_name || '-',
    status,
    cardCount: 0,
    cards: [],
  };
}

function mapBranchWithCards(
  vendor: VendorWithBranchesAndCards,
  branch: BranchWithCards
): VendorBranchListItem {
  return {
    id: branch.branch_id,
    vendorId: vendor.vendor_id,
    branchName: branch.branch_name,
    branchCode: vendor.gvid || '-',
    location: '-',
    vendorName: vendor.business_name || vendor.vendor_name || '-',
    status: branchStatusFromCards(branch.cards),
    cardCount: branch.cards.length,
    cards: branch.cards,
  };
}

export function extractVendorBranchListItems(
  data: unknown[] | undefined,
  filterVendorId?: string
): VendorBranchListItem[] {
  if (!Array.isArray(data) || data.length === 0) return [];

  if (isVendorWithBranches(data[0])) {
    const vendors = data as VendorWithBranchesAndCards[];
    return vendors
      .filter((vendor) => {
        if (!filterVendorId) return true;
        return String(vendor.vendor_id) === String(filterVendorId);
      })
      .flatMap((vendor) =>
        vendor.branches_with_cards.map((branch) =>
          mapBranchWithCards(vendor, branch)
        )
      );
  }

  if (isLegacyBranchRecord(data[0])) {
    return (data as VendorBranchRecord[])
      .filter((row) => {
        if (!filterVendorId) return true;
        return String(row.vendor_id) === String(filterVendorId);
      })
      .map(mapLegacyBranch);
  }

  return [];
}
