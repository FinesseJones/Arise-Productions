interface CopyrightNoticeProps {
  creator: string;
  date: Date;
}

export const CopyrightNotice = ({ creator, date }: CopyrightNoticeProps) => (
  <div className="text-xs text-muted-foreground mt-4 border-t pt-2">
    © {date.getFullYear()} {creator}. All rights reserved.
    Created using Finesse Jones Production Studio.
    Unauthorized reproduction or distribution prohibited.
  </div>
);

interface CopyrightFooterProps {
  className?: string;
}

export const CopyrightFooter = ({ className = "" }: CopyrightFooterProps) => (
  <div className={`text-xs text-muted-foreground text-center py-4 ${className}`}>
    © {new Date().getFullYear()} Finesse Jones Production Studio. All rights reserved.
  </div>
);
