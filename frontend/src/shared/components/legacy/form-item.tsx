import Textarea from "./textarea";

interface FormItemProps {
    name: string;
    label: string;
    inputPlaceholder: string;
    disabled: boolean;
}

function FormItem(props: FormItemProps) {
    return (
        <div className="flex flex-col gap-y-2">
            <label htmlFor={props.name}>{props.label}</label>
            <Textarea
                name={props.name}
                placeholder={props.inputPlaceholder}
                disabled={props.disabled}
            />
        </div>
    );
}

export { FormItem, type FormItemProps };

