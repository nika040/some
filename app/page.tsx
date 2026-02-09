"use client";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { farcasterConfig } from "../farcaster.config";
import { useMiniApp } from "./providers/MiniAppProvider";
import styles from "./page.module.css";

const WORDS = [
  "farcaster",
  "base",
  "wallet",
  "protocol",
  "smart",
  "contract",
  "onchain",
  "gasless",
  "miniapp",
  "builder",
  "token",
  "signal",
  "viral",
  "campaign",
  "community",
  "developer",
  "launch",
  "bridge",
  "staking",
  "quest",
  "mint",
  "badge",
  "score",
  "challenge",
  "arcade",
  "lighthouse",
];

const GAME_LENGTH_SECONDS = 60;
const WRONG_PENALTY = 2;
const SKIP_PENALTY = 3;

const scramble = (word: string) => {
  const chars = word.split("");
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  const scrambled = chars.join("");
  return scrambled === word ? scramble(word) : scrambled;
};

export default function Home() {
  const { context } = useMiniApp();
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const [currentWord, setCurrentWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_LENGTH_SECONDS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState("");

  const connector = useMemo(() => connectors[0], [connectors]);

  const pickWord = (previous?: string) => {
    const candidates = WORDS.filter((word) => word !== previous);
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  const prepareWord = (previous?: string) => {
    const next = pickWord(previous);
    setCurrentWord(next);
    setScrambledWord(scramble(next));
    setGuess("");
  };

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (timeLeft <= 0) {
      setIsPlaying(false);
      setMessage("Time! Tap play again to beat your score.");
      return;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [isPlaying, timeLeft]);

  const handleConnect = () => {
    if (!connector) {
      setMessage("No wallet connector available.");
      return;
    }
    connect({ connector });
  };

  const startGame = () => {
    if (!isConnected) {
      setMessage("Connect your Base account to play.");
      return;
    }
    setScore(0);
    setStreak(0);
    setTimeLeft(GAME_LENGTH_SECONDS);
    setIsPlaying(true);
    setMessage("Unscramble as many words as you can.");
    prepareWord();
  };

  const submitGuess = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isPlaying) {
      return;
    }

    const cleanedGuess = guess.trim().toLowerCase();
    if (!cleanedGuess) {
      setMessage("Type a word and press enter.");
      return;
    }

    if (cleanedGuess === currentWord.toLowerCase()) {
      setScore((value) => value + 1);
      setStreak((value) => value + 1);
      setMessage("Perfect! Keep the streak.");
      prepareWord(currentWord);
      return;
    }

    setStreak(0);
    setTimeLeft((value) => Math.max(0, value - WRONG_PENALTY));
    setMessage("Close! Try again or skip.");
  };

  const skipWord = () => {
    if (!isPlaying) {
      return;
    }
    setStreak(0);
    setTimeLeft((value) => Math.max(0, value - SKIP_PENALTY));
    setMessage("Skipped. New scramble incoming.");
    prepareWord(currentWord);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.title}>{farcasterConfig.miniapp.name}</span>
          <span className={styles.badge}>Word Mini Game</span>
        </div>
        <div className={styles.connectRow}>
          {isConnected ? (
            <>
              <div className={styles.accountPill}>
                {context?.user?.displayName || "Base Player"}
                <span className={styles.address}>
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""}
                </span>
              </div>
              <button className={styles.ghostButton} onClick={() => disconnect()} type="button">
                Disconnect
              </button>
            </>
          ) : (
            <button
              className={styles.connectButton}
              onClick={handleConnect}
              type="button"
              disabled={isPending}
            >
              {isPending ? "Connecting..." : "Connect Base Account"}
            </button>
          )}
        </div>
      </header>

      <main className={styles.content}>
        <section className={styles.gameCard}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Score</span>
              <span className={styles.statValue}>{score}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Streak</span>
              <span className={styles.statValue}>{streak}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Time</span>
              <span className={styles.statValue}>{timeLeft}s</span>
            </div>
          </div>

          <div className={styles.wordBox}>
            <p className={styles.scrambleLabel}>Scrambled Word</p>
            <p className={styles.scrambled}>{isPlaying ? scrambledWord : "Press Play"}</p>
            <p className={styles.hint}>
              Build your score by solving words fast. Wrong guesses cost {WRONG_PENALTY}s.
            </p>
          </div>

          <form className={styles.inputRow} onSubmit={submitGuess}>
            <input
              className={styles.input}
              type="text"
              placeholder="Type the word..."
              value={guess}
              onChange={(event) => setGuess(event.target.value)}
              disabled={!isPlaying}
            />
            <button className={styles.primaryButton} type="submit" disabled={!isPlaying}>
              Submit
            </button>
          </form>

          <div className={styles.actionRow}>
            <button className={styles.secondaryButton} type="button" onClick={startGame}>
              {isPlaying ? "Restart" : "Play"}
            </button>
            <button
              className={styles.ghostButton}
              type="button"
              onClick={skipWord}
              disabled={!isPlaying}
            >
              Skip (-{SKIP_PENALTY}s)
            </button>
          </div>

          {message && <p className={styles.message}>{message}</p>}
        </section>

        <section className={styles.footerCard}>
          <h2 className={styles.footerTitle}>How it works</h2>
          <p className={styles.footerText}>
            Connect with your Base account to unlock the word sprint. Solve as many scrambled
            words as possible before time runs out. Keep the streak alive for higher bragging rights.
          </p>
        </section>
      </main>
    </div>
  );
}
