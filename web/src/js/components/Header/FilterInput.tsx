import React, { Component } from "react";
import classnames from "classnames";
import Filt from "../../filt/filt";
import FilterDocs from "./FilterDocs";
import { Search, Tag, Pause, type LucideIcon } from "lucide-react";

export enum FilterIcon {
    SEARCH = "search",
    HIGHLIGHT = "tag",
    INTERCEPT = "pause",
}

const iconMap: Record<FilterIcon, LucideIcon> = {
    [FilterIcon.SEARCH]: Search,
    [FilterIcon.HIGHLIGHT]: Tag,
    [FilterIcon.INTERCEPT]: Pause,
};

type FilterInputProps = {
    icon: FilterIcon;
    color: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
};

type FilterInputState = {
    value: string;
    focus: boolean;
    mousefocus: boolean;
};

export default class FilterInput extends Component<
    FilterInputProps,
    FilterInputState
> {
    inputRef = React.createRef<HTMLInputElement>();

    constructor(props, context) {
        super(props, context);

        // Consider both focus and mouseover for showing/hiding the tooltip,
        // because onBlur of the input is triggered before the click on the tooltip
        // finalized, hiding the tooltip just as the user clicks on it.
        this.state = {
            value: this.props.value,
            focus: false,
            mousefocus: false,
        };

        this.onChange = this.onChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.selectFilter = this.selectFilter.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value });
    }

    isValid(filt: string) {
        try {
            if (filt) {
                Filt.parse(filt);
            }
            return true;
        } catch {
            return false;
        }
    }

    getDesc() {
        if (!this.state.value) {
            return <FilterDocs selectHandler={this.selectFilter} />;
        }
        try {
            return Filt.parse(this.state.value).desc;
        } catch (e) {
            return "" + e;
        }
    }

    onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        this.setState({ value });

        // Only propagate valid filters upwards.
        if (this.isValid(value)) {
            this.props.onChange(value);
        }
    }

    onFocus() {
        this.setState({ focus: true });
    }

    onBlur() {
        this.setState({ focus: false });
    }

    onMouseEnter() {
        this.setState({ mousefocus: true });
    }

    onMouseLeave() {
        this.setState({ mousefocus: false });
    }

    onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Escape" || e.key === "Enter") {
            this.blur();
            // If closed using ESC/ENTER, hide the tooltip.
            this.setState({ mousefocus: false });
        }
        e.stopPropagation();
    }

    selectFilter(value: string) {
        this.setState({ value });
        this.inputRef.current?.focus();

        // Only propagate valid filters upwards.
        if (this.isValid(value)) {
            this.props.onChange(value);
        }
    }

    blur() {
        this.inputRef.current?.blur();
    }

    select() {
        this.inputRef.current?.select();
    }

    render() {
        const { icon, color, placeholder } = this.props;
        const { value, focus, mousefocus } = this.state;
        const IconComponent = iconMap[icon];
        return (
            <div
                className={classnames("relative flex items-center my-1", {
                    "ring-2 ring-red-500": !this.isValid(value),
                })}
            >
                <span className="flex items-center justify-center px-2 bg-muted border border-r-0 border-input rounded-l h-8">
                    <IconComponent className="h-4 w-4" style={{ color }} />
                </span>
                <input
                    type="text"
                    ref={this.inputRef}
                    placeholder={placeholder}
                    className="h-8 px-2 py-1 text-sm bg-background border border-input rounded-r focus:outline-none focus:ring-1 focus:ring-ring min-w-[120px]"
                    value={value}
                    onChange={this.onChange}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    onKeyDown={this.onKeyDown}
                />
                {(focus || mousefocus) && (
                    <div
                        className="absolute top-full left-0 mt-1 z-50 w-64 p-3 bg-popover border border-border rounded-md shadow-md"
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
                    >
                        <div className="text-sm text-popover-foreground">{this.getDesc()}</div>
                    </div>
                )}
            </div>
        );
    }
}
