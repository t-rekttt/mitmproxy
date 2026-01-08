import React, { Component } from "react";
import { fetchApi } from "../../utils";
import { Loader2, ExternalLink } from "lucide-react";

type FilterDocsProps = {
    selectHandler: (cmd: string) => void;
};

type FilterDocsStates = {
    doc: { commands: string[][] };
};

export default class FilterDocs extends Component<
    FilterDocsProps,
    FilterDocsStates
> {
    // @todo move to redux

    static xhr: Promise<any> | null;
    static doc: { commands: string[][] };

    constructor(props, context) {
        super(props, context);
        this.state = { doc: FilterDocs.doc };
    }

    componentDidMount() {
        if (!FilterDocs.xhr) {
            FilterDocs.xhr = fetchApi("/filter-help").then((response) =>
                response.json(),
            );
            FilterDocs.xhr.catch(() => {
                FilterDocs.xhr = null;
            });
        }
        if (!this.state.doc) {
            FilterDocs.xhr.then((doc) => {
                FilterDocs.doc = doc;
                this.setState({ doc });
            });
        }
    }

    render() {
        const { doc } = this.state;
        return !doc ? (
            <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
            <table className="w-full text-xs">
                <tbody>
                    {doc.commands.map((cmd) => (
                        <tr
                            key={cmd[1]}
                            onClick={() =>
                                this.props.selectHandler(
                                    cmd[0].split(" ")[0] + " ",
                                )
                            }
                            className="hover:bg-muted/50 cursor-pointer"
                        >
                            <td className="py-0.5 pr-2 font-mono text-primary whitespace-nowrap">
                                {cmd[0].replace(" ", "\u00a0")}
                            </td>
                            <td className="py-0.5 text-muted-foreground">
                                {cmd[1]}
                            </td>
                        </tr>
                    ))}
                    <tr key="docs-link">
                        <td colSpan={2} className="pt-2">
                            <a
                                href="https://mitmproxy.org/docs/latest/concepts-filters/"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                                <ExternalLink className="h-3 w-3" />
                                mitmproxy docs
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
