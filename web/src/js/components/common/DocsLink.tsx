import * as React from "react";
import { HelpCircle } from "lucide-react";

type DocLinkProps = {
    children?: React.ReactNode;
    resource: string;
};

export default function DocsLink({ children, resource }: DocLinkProps) {
    const url = `https://docs.mitmproxy.org/stable/${resource}`;
    return (
        <a target="_blank" href={url} rel="noreferrer">
            {children || <HelpCircle className="h-4 w-4 inline-block" />}
        </a>
    );
}
