import * as React from "react";
import { formatTimeStamp } from "../../utils";
import type { Address, Client, Flow, Server } from "../../flow";

type ConnectionInfoProps = {
    conn: Client | Server;
};

export function formatAddress(
    desc: string,
    address: Address | undefined | null,
): React.ReactElement {
    if (!address) {
        return <></>;
    }
    // strip IPv6 flowid
    address = [address[0], address[1]];
    // Add IPv6 brackets
    if (address[0].includes(":")) {
        address[0] = `[${address[0]}]`;
    }
    return (
        <tr>
            <td className="py-1 pr-4 text-muted-foreground w-40">{desc}:</td>
            <td className="py-1">{address.join(":")}</td>
        </tr>
    );
}

export function ConnectionInfo({ conn }: ConnectionInfoProps) {
    let address_info: React.ReactElement;
    if ("address" in conn) {
        // Server
        address_info = (
            <>
                {formatAddress("Address", conn.address)}
                {formatAddress("Resolved address", conn.peername)}
                {formatAddress("Source address", conn.sockname)}
            </>
        );
    } else {
        // Client
        address_info = formatAddress("Address", conn.peername);
    }
    return (
        <table className="w-full text-sm">
            <tbody>
                {address_info}
                {conn.sni ? (
                    <tr>
                        <td className="py-1 pr-4 text-muted-foreground w-40">
                            <abbr title="TLS Server Name Indication">SNI</abbr>:
                        </td>
                        <td className="py-1">{conn.sni}</td>
                    </tr>
                ) : null}
                {conn.alpn ? (
                    <tr>
                        <td className="py-1 pr-4 text-muted-foreground w-40">
                            <abbr title="ALPN protocol negotiated">ALPN</abbr>:
                        </td>
                        <td className="py-1">{conn.alpn}</td>
                    </tr>
                ) : null}
                {conn.tls_version ? (
                    <tr>
                        <td className="py-1 pr-4 text-muted-foreground w-40">TLS Version:</td>
                        <td className="py-1">{conn.tls_version}</td>
                    </tr>
                ) : null}
                {conn.cipher ? (
                    <tr>
                        <td className="py-1 pr-4 text-muted-foreground w-40">TLS Cipher:</td>
                        <td className="py-1">{conn.cipher}</td>
                    </tr>
                ) : null}
            </tbody>
        </table>
    );
}

function attrList(data: [string, string][]): React.ReactElement {
    return (
        <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-sm">
            {data.map(([k, v]) => (
                <React.Fragment key={k}>
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="text-foreground">{v}</dd>
                </React.Fragment>
            ))}
        </dl>
    );
}

export function CertificateInfo({ flow }: { flow: Flow }): React.ReactElement {
    const cert = flow.server_conn?.cert;
    if (!cert) return <></>;

    return (
        <>
            <h4 key="name" className="text-sm font-semibold mt-4 mb-2">Server Certificate</h4>
            <table className="w-full text-sm">
                <tbody>
                    <tr>
                        <td className="py-1 pr-4 text-muted-foreground w-40">Type</td>
                        <td className="py-1">
                            {cert.keyinfo[0]}, {cert.keyinfo[1]} bits
                        </td>
                    </tr>
                    <tr>
                        <td className="py-1 pr-4 text-muted-foreground w-40">SHA256 digest</td>
                        <td className="py-1 font-mono text-xs break-all">{cert.sha256}</td>
                    </tr>
                    <tr>
                        <td className="py-1 pr-4 text-muted-foreground w-40">Valid from</td>
                        <td className="py-1">
                            {formatTimeStamp(cert.notbefore, {
                                includeMilliseconds: false,
                            })}
                        </td>
                    </tr>
                    <tr>
                        <td className="py-1 pr-4 text-muted-foreground w-40">Valid to</td>
                        <td className="py-1">
                            {formatTimeStamp(cert.notafter, {
                                includeMilliseconds: false,
                            })}
                        </td>
                    </tr>
                    <tr>
                        <td className="py-1 pr-4 text-muted-foreground w-40">Subject Alternative Names</td>
                        <td className="py-1">{cert.altnames.join(", ")}</td>
                    </tr>
                    <tr>
                        <td className="py-1 pr-4 text-muted-foreground w-40 align-top">Subject</td>
                        <td className="py-1">{attrList(cert.subject)}</td>
                    </tr>
                    <tr>
                        <td className="py-1 pr-4 text-muted-foreground w-40 align-top">Issuer</td>
                        <td className="py-1">{attrList(cert.issuer)}</td>
                    </tr>
                    <tr>
                        <td className="py-1 pr-4 text-muted-foreground w-40">Serial</td>
                        <td className="py-1 font-mono text-xs">{cert.serial}</td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}

export default function Connection({ flow }: { flow: Flow }) {
    return (
        <section className="p-4 space-y-4">
            <h4 className="text-sm font-semibold">Client Connection</h4>
            <ConnectionInfo conn={flow.client_conn} />

            {flow.server_conn?.address && (
                <>
                    <h4 className="text-sm font-semibold mt-4">Server Connection</h4>
                    <ConnectionInfo conn={flow.server_conn} />
                </>
            )}

            <CertificateInfo flow={flow} />
        </section>
    );
}
Connection.displayName = "Connection";
