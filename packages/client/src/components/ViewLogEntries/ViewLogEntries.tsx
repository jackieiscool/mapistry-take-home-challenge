import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useLastVisitedLog } from '../../hooks/useLastVisitedLog';
import { useLogEntries } from '../../hooks/useLogEntries';
import { EditLogEntryRequest } from '@mapistry/take-home-challenge-shared';
import { createLogEntry, editLogEntry } from '../../shared/apiClient/logsApi';
import { Error } from '../shared/Error';
import { Loading } from '../shared/Loading';
import { CreateOrEditLogEntryModal } from './CreateOrEditLogEntryModal';
import { ViewLogEntriesEmptyPage } from './ViewLogEntriesEmptyPage';
import { ViewLogEntriesHeader } from './ViewLogEntriesHeader';
import { ViewLogEntriesTable } from './ViewLogEntriesTable';

const Container = styled.div`
  height: 100vh;
`;

export function ViewLogEntries() {
  const { lastVisitedLog } = useLastVisitedLog();
  const { logEntries, error, isLoading, refreshLogEntries } = useLogEntries({
    logId: lastVisitedLog.id,
  });
  const [isCreateEntryOpen, setIsCreateEntryOpen] = useState(false);
  const [isEditEntryOpen, setIsEditEntryOpen] = useState(false);
  const [currentLogEntry, setCurrentLogEntry] = useState<EditLogEntryRequest>();

  const handleAddNew = useCallback(async () => {
    setIsCreateEntryOpen(true);
  }, []);

  const handleEditEntry = useCallback(async (logEntry: EditLogEntryRequest) => {
    setCurrentLogEntry(logEntry);
    setIsEditEntryOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsCreateEntryOpen(false);
    setIsEditEntryOpen(false);
  }, [setIsCreateEntryOpen]);

  const handleCreateLogEntry = useCallback(
    async (logEntry) => {
      await createLogEntry({ logId: lastVisitedLog.id, logEntry });
      setIsCreateEntryOpen(false);
      refreshLogEntries();
    },
    [lastVisitedLog, refreshLogEntries, setIsCreateEntryOpen],
  );

  const handleEditLogEntry = useCallback(
    async (logEntry) => {
      await editLogEntry({ logEntry });
      setIsEditEntryOpen(false);
      refreshLogEntries();
    },
    [refreshLogEntries, setIsEditEntryOpen]
  );

  function content() {
    if (isLoading) {
      return <Loading />;
    }
    if (error) {
      return (
        <Error message="Sorry, there was an error loading the log entries." />
      );
    }
    return logEntries.length ? (
      <ViewLogEntriesTable logId={lastVisitedLog.id} onEditLog={handleEditEntry} />
    ) : (
      <ViewLogEntriesEmptyPage />
    );
  }

  return (
    <Container>
      {isCreateEntryOpen && (
        <CreateOrEditLogEntryModal
          handleClose={handleCloseModal}
          handleCreateOrUpdate={handleCreateLogEntry}
        />
      )}
      {/* TODO: combine these two modal references*/}
      {isEditEntryOpen && currentLogEntry && (
        <CreateOrEditLogEntryModal
          handleClose={handleCloseModal}
          handleCreateOrUpdate={handleEditLogEntry}
          isEditMode={true}
          currentLogEntry={currentLogEntry}
        />
      )}
      <ViewLogEntriesHeader
        onAddNew={handleAddNew}
        logName={lastVisitedLog.name}
      />
      {content()}
    </Container>
  );
}
