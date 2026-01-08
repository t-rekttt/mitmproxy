import React, { Component } from "react";
import { cn } from "@/lib/utils";

type SplitterState = {
    applied: boolean;
    startPos: number;
    // .dragPointer === 0.1 means not dragging
    dragPointer: number;
};

type SplitterProps = {
    axis: string;
};

export default class Splitter extends Component<SplitterProps, SplitterState> {
    static defaultProps = { axis: "x" };

    node = React.createRef<HTMLDivElement>();

    constructor(props, context) {
        super(props, context);
        this.state = { applied: false, startPos: 0, dragPointer: 0.1 };
        this.onLostPointerCapture = this.onLostPointerCapture.bind(this);
        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
    }

    onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
        if (this.state.dragPointer !== 0.1) {
            return;
        }
        (e.target as HTMLDivElement).setPointerCapture(e.pointerId);
        this.setState({
            startPos: this.props.axis === "x" ? e.pageX : e.pageY,
            dragPointer: e.pointerId,
        });
    }

    onLostPointerCapture(e: React.PointerEvent<HTMLDivElement>) {
        if (this.state.dragPointer !== e.pointerId) {
            return;
        }
        const node = this.node.current!;
        const prev = node.previousElementSibling! as HTMLElement;
        const next = node.nextElementSibling! as HTMLElement;

        node.style.transform = "";
        prev.style.flex = `0 0 ${Math.max(
            0,
            (this.props.axis === "x"
                ? prev.offsetWidth + e.pageX
                : prev.offsetHeight + e.pageY) - this.state.startPos,
        )}px`;
        next.style.flex = "1 1 auto";

        this.setState({ applied: true, dragPointer: 0.1 });
        this.onResize();
    }

    onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
        if (this.state.dragPointer !== e.pointerId) {
            return;
        }
        this.node.current!.style.transform =
            this.props.axis === "x"
                ? `translateX(${e.pageX - this.state.startPos}px)`
                : `translateY(${e.pageY - this.state.startPos}px)`;
    }

    onResize() {
        // Trigger a global resize event. This notifies components that employ virtual scrolling
        // that their viewport may have changed.
        window.setTimeout(
            () => window.dispatchEvent(new CustomEvent("resize")),
            1,
        );
    }

    reset(willUnmount) {
        if (!this.state.applied) {
            return;
        }

        if (this.node.current?.previousElementSibling instanceof HTMLElement) {
            this.node.current.previousElementSibling.style.flex = "";
        }
        if (this.node.current?.nextElementSibling instanceof HTMLElement) {
            this.node.current.nextElementSibling.style.flex = "";
        }

        if (!willUnmount) {
            this.setState({ applied: false });
        }
        this.onResize();
    }

    componentWillUnmount() {
        this.reset(true);
    }

    render() {
        const isHorizontal = this.props.axis === "x";

        return (
            <div
                ref={this.node}
                className={cn(
                    "flex-shrink-0 relative z-10",
                    isHorizontal ? "w-1 h-full" : "w-full h-1",
                )}
            >
                <div
                    className={cn(
                        "absolute bg-border hover:bg-primary/50 transition-colors",
                        isHorizontal
                            ? "w-1 h-full cursor-col-resize left-0"
                            : "w-full h-1 cursor-row-resize top-0",
                    )}
                    onLostPointerCapture={this.onLostPointerCapture}
                    onPointerDown={this.onPointerDown}
                    onPointerMove={this.onPointerMove}
                />
            </div>
        );
    }
}
