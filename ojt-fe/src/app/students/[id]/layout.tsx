import {type ReactNode, Fragment} from "react";

type LayoutProps = Readonly<{children: ReactNode; slot: ReactNode}>;

export default function Layout(props: LayoutProps) {
    return (
        <Fragment>
            {props.children}
            {props.slot}
        </Fragment>
    );
}
