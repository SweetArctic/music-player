import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert } from "lucide-react";

import "./modal.css";

export default function Modal({ modalSize = "lg" }: { modalSize?: "sm" | "lg" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)} className="modal-button">
        About
      </button>

      <AnimatePresence>
        {isOpen && (
          <div onClick={() => setIsOpen(false)} className="modal-overlay">
            <motion.div
              initial={{ scale: 0, rotate: "180deg" }}
              animate={{
                scale: 1,
                rotate: "0deg",
                transition: {
                  type: "spring",
                  bounce: 0.25,
                },
              }}
              exit={{ scale: 0, rotate: "180deg" }}
              onClick={(e) => e.stopPropagation()}
              className={`modal-content ${modalSize === "sm" ? "modal-sm" : "modal-lg"}`}
            >
              <div className="modal-body">
                <CircleAlert className="modal-icon" size={48} />
                <h3 className={`modal-title ${modalSize === "sm" ? "title-sm" : ""}`}>
                  Welcome to Player Max!
                </h3>
                <p className="modal-text">
                  Created by: SweetArctic <br></br>
                  Github: SweetArctic
                </p>
                <div className="modal-buttons">
                  <button onClick={() => setIsOpen(false)} className="modal-close">
                    Close!
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}