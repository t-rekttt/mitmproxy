/* eslint-disable react/prop-types */
import type { ComponentProps } from "react";
import React from "react";
import type { Option } from "../../ducks/options";
import { update as updateOptions } from "../../ducks/options";
import { useAppDispatch, useAppSelector } from "../../ducks";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const stopPropagation = (e) => {
    if (e.key !== "Escape") {
        e.stopPropagation();
    }
};

interface OptionProps<S>
    extends Omit<
        ComponentProps<"input"> &
            ComponentProps<"select"> &
            ComponentProps<"textarea">,
        "value" | "onChange"
    > {
    value: S;
    onChange: (value: S) => any;
}

function BooleanOption({ value, onChange, name, ...props }: OptionProps<boolean> & { name?: string }) {
    return (
        <div className="flex items-center space-x-2">
            <Switch
                id={name}
                checked={value}
                onCheckedChange={onChange}
            />
            <Label htmlFor={name} className="text-sm text-muted-foreground">
                Enable
            </Label>
        </div>
    );
}

function StringOption({ value, onChange, ...props }: OptionProps<string>) {
    return (
        <Input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="h-8"
            {...props}
        />
    );
}

function Optional(Component) {
    return function OptionalWrapper({ onChange, ...props }) {
        return (
            <Component onChange={(x) => onChange(x ? x : null)} {...props} />
        );
    };
}

function NumberOption({ value, onChange, ...props }: OptionProps<number>) {
    return (
        <Input
            type="number"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="h-8"
            {...props}
        />
    );
}

interface ChoiceOptionProps extends OptionProps<string> {
    choices: string[];
}

export function ChoicesOption({
    value,
    onChange,
    choices,
    name,
    ...props
}: ChoiceOptionProps & { name?: string }) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="h-8">
                <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
                {choices.map((choice) => (
                    <SelectItem key={choice} value={choice}>
                        {choice}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function StringSequenceOption({
    value,
    onChange,
    ...props
}: OptionProps<string[]>) {
    const height = Math.max(value.length, 1);

    const [textAreaValue, setTextAreaValue] = React.useState(value.join("\n"));

    const handleChange = (e) => {
        const newValue = e.target.value;
        setTextAreaValue(newValue);
        onChange(
            newValue
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line !== ""),
        );
    };

    return (
        <Textarea
            rows={height}
            value={textAreaValue}
            onChange={handleChange}
            className="min-h-[60px] resize-y"
            {...props}
        />
    );
}

export const Options = {
    bool: BooleanOption,
    str: StringOption,
    int: NumberOption,
    "optional str": Optional(StringOption),
    "optional int": Optional(NumberOption),
    "sequence of str": StringSequenceOption,
};

function PureOption({ choices, type, value, onChange, name, error }) {
    let Opt;
    const props: Partial<OptionProps<any> & ChoiceOptionProps & { name?: string }> = {
        onChange,
        value,
        name,
    };
    if (choices) {
        Opt = ChoicesOption;
        props.choices = choices;
    } else {
        Opt = Options[type];
        if (!Opt) throw `unknown option type ${type}`;
    }

    return (
        <div className={cn(error && "ring-2 ring-destructive rounded-md")}>
            <Opt onKeyDown={stopPropagation} {...props} />
        </div>
    );
}

export default function OptionInput({ name }: { name: Option }) {
    const dispatch = useAppDispatch();
    const choices = useAppSelector(
        (state) => state.options_meta[name]?.choices,
    );
    const type = useAppSelector((state) => state.options_meta[name]?.type);
    const value = useAppSelector((state) => {
        const editState = state.ui.optionsEditor[name];
        return editState ? editState.value : state.options_meta[name]?.value;
    });
    const error = useAppSelector(
        (state) => state.ui.optionsEditor[name]?.error,
    );

    return (
        <PureOption
            name={name}
            choices={choices}
            type={type}
            value={value}
            error={error}
            onChange={(value) => dispatch(updateOptions(name, value))}
        />
    );
}
