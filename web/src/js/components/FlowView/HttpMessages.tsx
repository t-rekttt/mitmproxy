import * as React from "react";

import {
    isValidHttpVersion,
    MessageUtils,
    parseUrl,
    RequestUtils,
} from "../../flow/utils";
import ValidateEditor from "../editors/ValidateEditor";
import ValueEditor from "../editors/ValueEditor";

import { useAppDispatch, useAppSelector } from "../../ducks";
import type { HTTPFlow, HTTPMessage, HTTPResponse } from "../../flow";
import * as flowActions from "../../ducks/flows";
import KeyValueListEditor from "../editors/KeyValueListEditor";
import HttpMessage from "../contentviews/HttpMessage";

type RequestLineProps = {
    flow: HTTPFlow;
};

function RequestLine({ flow }: RequestLineProps) {
    const dispatch = useAppDispatch();

    return (
        <div className="flex items-center gap-1 px-4 py-2 font-mono text-sm bg-muted/30 border-b border-border">
            <ValidateEditor
                content={flow.request.method}
                onEditDone={(method) =>
                    dispatch(
                        flowActions.update(flow, { request: { method } }),
                    )
                }
                isValid={(method) => method.length > 0}
                selectAllOnClick={true}
            />
            <ValidateEditor
                content={RequestUtils.pretty_url(flow.request)}
                onEditDone={(url) =>
                    dispatch(
                        flowActions.update(flow, {
                            request: { path: "", ...parseUrl(url) },
                        }),
                    )
                }
                isValid={(url) => !!parseUrl(url)?.host}
            />
            <ValidateEditor
                content={flow.request.http_version}
                onEditDone={(http_version) =>
                    dispatch(
                        flowActions.update(flow, {
                            request: { http_version },
                        }),
                    )
                }
                isValid={isValidHttpVersion}
                selectAllOnClick={true}
            />
        </div>
    );
}

type ResponseLineProps = {
    flow: HTTPFlow & { response: HTTPResponse };
};

function ResponseLine({ flow }: ResponseLineProps) {
    const dispatch = useAppDispatch();

    return (
        <div className="flex items-center gap-1 px-4 py-2 font-mono text-sm bg-muted/30 border-b border-border">
            <ValidateEditor
                content={flow.response.http_version}
                onEditDone={(nextVer) =>
                    dispatch(
                        flowActions.update(flow, {
                            response: { http_version: nextVer },
                        }),
                    )
                }
                isValid={isValidHttpVersion}
                selectAllOnClick={true}
            />
            <ValidateEditor
                content={flow.response.status_code + ""}
                onEditDone={(code) =>
                    dispatch(
                        flowActions.update(flow, {
                            response: { code: parseInt(code) },
                        }),
                    )
                }
                isValid={(code) => /^\d+$/.test(code)}
                selectAllOnClick={true}
            />
            {flow.response.http_version !== "HTTP/2.0" && (
                <ValueEditor
                    content={flow.response.reason}
                    onEditDone={(msg) =>
                        dispatch(
                            flowActions.update(flow, { response: { msg } }),
                        )
                    }
                    selectAllOnClick={true}
                />
            )}
        </div>
    );
}

type HeadersProps = {
    flow: HTTPFlow;
    message: HTTPMessage;
};

function Headers({ flow, message }: HeadersProps) {
    const dispatch = useAppDispatch();
    const part = flow.request === message ? "request" : "response";

    return (
        <KeyValueListEditor
            className="px-4 py-2"
            data={message.headers}
            onChange={(headers) =>
                dispatch(flowActions.update(flow, { [part]: { headers } }))
            }
        />
    );
}

type TrailersProps = {
    flow: HTTPFlow;
    message: HTTPMessage;
};

function Trailers({ flow, message }: TrailersProps) {
    const dispatch = useAppDispatch();
    const part = flow.request === message ? "request" : "response";
    const hasTrailers = !!MessageUtils.get_first_header(message, /^trailer$/i);

    if (!hasTrailers) return null;

    return (
        <div className="border-t border-border">
            <h5 className="px-4 py-2 text-sm font-medium text-muted-foreground">HTTP Trailers</h5>
            <KeyValueListEditor
                className="px-4 py-2"
                data={message.trailers}
                onChange={(trailers) =>
                    dispatch(flowActions.update(flow, { [part]: { trailers } }))
                }
            />
        </div>
    );
}

const Message = React.memo(function Message({
    flow,
    message,
}: {
    flow: HTTPFlow;
    message: HTTPMessage;
}) {
    const part = flow.request === message ? "request" : "response";
    const FirstLine = flow.request === message ? RequestLine : ResponseLine;

    return (
        <section className="divide-y divide-border">
            <FirstLine flow={flow} />
            <Headers flow={flow} message={message} />
            <HttpMessage key={flow.id + part} flow={flow} message={message} />
            <Trailers flow={flow} message={message} />
        </section>
    );
});

export function Request() {
    const flow = useAppSelector((state) => state.flows.selected[0]) as HTTPFlow;
    return <Message flow={flow} message={flow.request} />;
}
Request.displayName = "Request";

export function Response() {
    const flow = useAppSelector(
        (state) => state.flows.selected[0],
    ) as HTTPFlow & { response: HTTPResponse };
    return <Message flow={flow} message={flow.response} />;
}
Response.displayName = "Response";
