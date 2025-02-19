import {
  CreateLogEntryRequest,
  EditLogEntryRequest,
  LogEntryResponse,
} from '@mapistry/take-home-challenge-shared';

export interface CreateLogEntryParams {
  logId: string;
  logEntry: CreateLogEntryRequest;
}

export interface EditLogEntryParams {
  logEntry: EditLogEntryRequest;
}

export type FetchLogEntriesResponse = LogEntryResponse[];
export type CreateLogEntryResponse = LogEntryResponse;
export type EditLogEntryResponse = LogEntryResponse;

export async function fetchLogEntries(
  logId: string,
): Promise<FetchLogEntriesResponse> {
  const res = await fetch(`/api/logs/${logId}/log-entries`, {
    method: 'get',
    headers: {
      'content-type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch log entries');
  }
  const logEntries: FetchLogEntriesResponse = await res.json();
  return logEntries;
}

export async function createLogEntry({
  logId,
  logEntry,
}: CreateLogEntryParams): Promise<CreateLogEntryResponse> {
  const res = await fetch(`/api/logs/${logId}/log-entries`, {
    body: JSON.stringify({ logEntry }),
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Failed to create log entry');
  }
  const newlogEntry: CreateLogEntryResponse = await res.json();
  return newlogEntry;
}

export async function editLogEntry({
  logEntry,
}: EditLogEntryParams): Promise<EditLogEntryResponse> {
  console.log("Edit Entry");
  console.log(logEntry);
  const res = await fetch(`/api/logs/${logEntry.logId}/log-entries/${logEntry.id}`, {
    body: JSON.stringify({ logEntry }),
    method: 'put',
    headers: {
      'content-type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Failed to create log entry');
  }
  const updatedLogEntry: EditLogEntryResponse = await res.json();
  return updatedLogEntry;
  // return logEntry;
}

export async function deleteLogEntry(logEntry: LogEntryResponse) {
  const { logId, id } = logEntry;
  const res = await fetch(`/api/logs/${logId}/log-entries/${id}`, {
    method: 'delete',
    headers: {
      'content-type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Failed to delete log entry');
  }
}
