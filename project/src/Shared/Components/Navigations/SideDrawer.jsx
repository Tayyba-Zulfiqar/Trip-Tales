import "./SideDrawer.css";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import { useRef } from "react";
import "../../../../index.css";

export default function SideDrawer(props) {
  const noderef = useRef(null);
  const content = (
    <CSSTransition
      noderef={noderef}
      in={props.show}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer" ref={noderef} onClick={props.onClick}>
        {props.children}
      </aside>
    </CSSTransition>
  );

  //creating and returning react portal:
  //For: keeping component outside parent hierarchy but still logically connected
  return ReactDOM.createPortal(content, document.getElementById("drawer-hook"));
}
