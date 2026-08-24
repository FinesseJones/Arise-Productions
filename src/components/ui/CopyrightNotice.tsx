import { LEGAL_INFO } from '@/config/legal';

interface CopyrightNoticeProps {
  creator: string;
  date: Date;
}

export const CopyrightNotice = ({ creator, date }: CopyrightNoticeProps) => (
  <div className="text-xs text-muted-foreground mt-4 border-t pt-2">
    © {date.getFullYear()} {creator}. All rights reserved.
    <br />
    Created using {LEGAL_INFO.product.name_with_tm}.
    <br />
    Unauthorized reproduction or distribution prohibited.
  </div>
);

interface CopyrightFooterProps {
  className?: string;
}

export const CopyrightFooter = ({ className = "" }: CopyrightFooterProps) => (
  <div className={`text-xs text-muted-foreground text-center py-4 ${className}`}>
    {LEGAL_INFO.copyright.full_notice}
    <br />
    {LEGAL_INFO.company.legal_name} • {LEGAL_INFO.contact.city}, {LEGAL_INFO.contact.state}
  </div>
);

export const BrandName = ({ className = "" }: { className?: string }) => (
  <span className={className}>{LEGAL_INFO.product.name_with_tm}</span>
);
