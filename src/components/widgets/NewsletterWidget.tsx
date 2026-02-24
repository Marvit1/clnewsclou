"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import styles from "./NewsletterWidget.module.css";
import { motion, AnimatePresence } from "framer-motion";

const NewsletterWidget = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");
        // Simulate API call
        setTimeout(() => {
            setStatus("success");
            setEmail("");
        }, 1500);
    };

    return (
        <div className={styles.widget}>
            <h3 className={styles.title}>Newsletter</h3>
            <p className={styles.description}>
                Get the latest news delivered straight to your inbox every morning.
            </p>

            <AnimatePresence mode="wait">
                {status === "success" ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={styles.successMessage}
                    >
                        <CheckCircle2 size={32} className={styles.successIcon} />
                        <p>You're subscribed!</p>
                    </motion.div>
                ) : (
                    <motion.form
                        key="form"
                        onSubmit={handleSubmit}
                        className={styles.form}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div className={styles.inputWrapper}>
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                                required
                            />
                            <button
                                type="submit"
                                className={styles.subscribeButton}
                                disabled={status === "loading"}
                            >
                                {status === "loading" ? (
                                    <div className={styles.spinner} />
                                ) : (
                                    <Send size={16} />
                                )}
                            </button>
                        </div>
                        <p className={styles.privacy}>
                            By subscribing, you agree to our Privacy Policy.
                        </p>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NewsletterWidget;
