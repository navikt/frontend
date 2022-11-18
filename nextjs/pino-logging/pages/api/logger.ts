import pino, { BaseLogger } from "pino";
import { NextApiRequest, NextApiResponse } from "next";

import { logger } from "../../utils/logger";

type LogLevels = Exclude<keyof BaseLogger, 'string' | 'level'>;

const levels: LogLevels[] = [
    "error",
    "debug",
    "fatal",
    "info",
    "trace",
    "silent",
    "warn",
];

function isValidLoggingLabel(label: unknown): label is LogLevels {
    return typeof label === "string" && label in levels;
}

const loggingHandler = (req: NextApiRequest, res: NextApiResponse): void => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { level, ts }: pino.LogEvent = req.body;
    const label: unknown = level.label;
    if (!isValidLoggingLabel(label)) {
        res.status(400).json({
            error: `Invalid label ${label}`,
        });
        return
    }

    const messages: [objOrMsg: unknown, msgOrArgs?: string] = req.body.messages;

    logger
        .child({
            x_timestamp: ts,
            x_isFrontend: true,
            x_userAgent: req.headers['user-agent'],
            x_request_id: req.headers['x-request-id'] ?? 'not-set',
        })
        [label](...messages);

    res.status(200).json({ ok: `ok` });
}

export default loggingHandler;
