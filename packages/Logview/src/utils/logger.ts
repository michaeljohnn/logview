type LogType = "info" | "warn" | "debug" | "error" | "critical";

const highlightStyle: { [level: string]: string } = {
  critical: "background-color: #3da9fc; color: #fff; padding: 6px 10px;",
  debug: "background-color: lightblue; color: #333; padding: 1px 10px;",
};

export class Logger {
  constructor() {}

  private log(type: LogType, ...args: any[]) {
    try {
      const [message, ...rest] = args;

      let logFn = console.log;

      switch (type) {
        case "warn":
          logFn = console.warn;
          break;
        case "error":
          logFn = console.error;
          break;
      }

      switch (type) {
        case "critical":
          this.highlight("critical", message, ...rest);
          break;
        case "debug":
          const isDebug = localStorage.getItem("savorui_DEBUG") === "true";

          if (isDebug) {
            this.highlight("debug", message, performance.now(), ...rest);
          }
          break;
        default:
          logFn(`[savorui ${type.toUpperCase()}] ${message}`, ...rest);
          break;
      }
    } catch (err) {
      console.error("TRE Logger Error", err);
    }
  }

  highlight(logType: LogType, message: string, ...rest: any[]) {
    console.log(
      `[savorui ${logType.toUpperCase()}] %c${message}`,
      highlightStyle[logType] || highlightStyle["critical"],
      ...rest,
    );
  }

  info(...args: any[]) {
    this.log("info", ...args);
  }

  warn(...args: any[]) {
    this.log("warn", ...args);
  }

  debug(...args: any[]) {
    this.log("debug", ...args);
  }

  error(...args: any[]) {
    this.log("error", ...args);
  }

  // 重要日志，使用高亮输出
  critical(message: string, ...rest: any[]) {
    this.highlight("critical", message, ...rest);
  }
}

export const logger = new Logger();
