import { Component } from "react";
import { onKeyDown } from "../ducks/ui/keyboard";
import MainView from "./MainView";
import Header from "./Header";
import CommandBar from "./CommandBar";
import EventLog from "./EventLog";
import Footer from "./Footer";
import Modal from "./Modal/Modal";
import type { RootState } from "../ducks";
import { connect } from "react-redux";
import { cn } from "@/lib/utils";

type ProxyAppMainProps = {
    showEventLog: boolean;
    showCommandBar: boolean;
    onKeyDown: (e: KeyboardEvent) => void;
};

type ProxyAppMainState = {
    error?: Error;
    errorInfo?: React.ErrorInfo;
};

class ProxyAppMain extends Component<ProxyAppMainProps, ProxyAppMainState> {
    state: ProxyAppMainState = {};

    render = () => {
        const { showEventLog, showCommandBar } = this.props;

        if (this.state.error) {
            console.log("ERR", this.state);
            return (
                <div className="flex flex-col items-center justify-center min-h-screen p-8">
                    <h1 className="text-2xl font-bold text-destructive mb-4">
                        mitmproxy has crashed.
                    </h1>
                    <pre className="bg-muted p-4 rounded-lg overflow-auto max-w-full text-sm mb-4">
                        {this.state.error.stack}
                        <br />
                        <br />
                        Component Stack:
                        {this.state.errorInfo?.componentStack}
                    </pre>
                    <p className="text-muted-foreground">
                        Please lodge a bug report at{" "}
                        <a
                            href="https://github.com/mitmproxy/mitmproxy/issues"
                            className="text-primary underline hover:text-primary/80"
                        >
                            https://github.com/mitmproxy/mitmproxy/issues
                        </a>
                        .
                    </p>
                </div>
            );
        }

        return (
            <div
                id="container"
                tabIndex={0}
                className={cn(
                    "flex flex-col h-full outline-none",
                    "bg-background text-foreground",
                )}
            >
                <Header />
                <MainView />
                {showCommandBar && <CommandBar key="commandbar" />}
                {showEventLog && <EventLog key="eventlog" />}
                <Footer />
                <Modal />
            </div>
        );
    };

    componentDidMount() {
        window.addEventListener("keydown", this.props.onKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.props.onKeyDown);
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({ error, errorInfo });
    }
}

export default connect(
    (state: RootState) => ({
        showEventLog: state.eventLog.visible,
        showCommandBar: state.commandBar.visible,
    }),
    {
        onKeyDown,
    },
)(ProxyAppMain);
