import { useState, useRef, useLayoutEffect } from "react";
import data from "./data";
import "./style.css";

export default function Accordian() {
  const [selected, setSelected] = useState(null);
  const [enableMultiSelection, setEnableMultiSelection] = useState(false);
  const [multiple, setMultiple] = useState([]);

  const contentRefs = useRef({});

  function setContentRef(id, node) {
    if (node) contentRefs.current[id] = node;
    else delete contentRefs.current[id];
  }

  function expandAll() {
    setEnableMultiSelection(true);
    setMultiple(data.map((d) => d.id));
  }

  function collapseAll() {
    setMultiple([]);
    setSelected(null);
    setEnableMultiSelection(false);
  }

  useLayoutEffect(() => {
    data.forEach((d) => {
      const el = contentRefs.current[d.id];
      if (!el) return;
      const isOpen = enableMultiSelection
        ? multiple.indexOf(d.id) !== -1
        : selected === d.id;
      if (isOpen) {
        el.style.maxHeight = el.scrollHeight + "px";
        el.classList.add("open");
      } else {
        el.style.maxHeight = "0px";
        el.classList.remove("open");
      }
    });
  }, [selected, multiple, enableMultiSelection]);

  function handleSingleSelection(getCurrentId) {
    setSelected(getCurrentId === selected ? null : getCurrentId);
  }

  function handleMultiSelection(getCurrentId) {
    let cpyMultiple = [...multiple];
    const findIndexOfCurrentId = cpyMultiple.indexOf(getCurrentId);
    if (findIndexOfCurrentId === -1) cpyMultiple.push(getCurrentId);
    else cpyMultiple.splice(findIndexOfCurrentId, 1);

    setMultiple(cpyMultiple);
  }

  return (
    <div className="root">
      <div className="container">
        <div className="controls">
          <div className="controls-left">
            <button className="toggle-btn" type="button" onClick={expandAll}>
              Expand all
            </button>
            <button className="toggle-btn" type="button" onClick={collapseAll}>
              Collapse all
            </button>
          </div>
          <div className="controls-right">
            <button
              className="toggle-btn"
              type="button"
              onClick={() => setEnableMultiSelection(!enableMultiSelection)}
              aria-pressed={enableMultiSelection}
            >
              {enableMultiSelection ? "Multi" : "Single"}
            </button>
          </div>
        </div>

        <div className="accordian">
          {data && data.length > 0 ? (
            data.map((dataItem) => {
              const isOpen = enableMultiSelection
                ? multiple.indexOf(dataItem.id) !== -1
                : selected === dataItem.id;

              return (
                <div key={dataItem.id} className="item">
                  <div className="title">
                    <button
                      id={`title-${dataItem.id}`}
                      type="button"
                      className="title-button"
                      onClick={
                        enableMultiSelection
                          ? () => handleMultiSelection(dataItem.id)
                          : () => handleSingleSelection(dataItem.id)
                      }
                      aria-expanded={isOpen}
                      aria-controls={`content-${dataItem.id}`}
                    >
                      <h3>{dataItem.question}</h3>
                      <span
                        className={`chev ${isOpen ? "open" : ""}`}
                        aria-hidden
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden
                        >
                          <path
                            d="M12 5v14M5 12h14"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>

                  <div
                    id={`content-${dataItem.id}`}
                    ref={(el) => setContentRef(dataItem.id, el)}
                    className={`content ${isOpen ? "open" : ""}`}
                    role="region"
                    aria-labelledby={`title-${dataItem.id}`}
                  >
                    {dataItem.answer}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty">No data found</div>
          )}
        </div>
      </div>
    </div>
  );
}
