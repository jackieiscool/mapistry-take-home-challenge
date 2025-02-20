import { DateLike, CreateLogEntryRequest, EditLogEntryRequest } from '@mapistry/take-home-challenge-shared';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';

interface CreateOrEditLogEntryProps {
  handleClose: () => void;
  handleCreateOrUpdate: (logEntry: CreateLogEntryRequest | EditLogEntryRequest) => void;
  currentLogEntry?: EditLogEntryRequest;
}

interface LogEntryFormProps {
  logValue: string;
  logDate: DateLike;
  id?: string;
  logId?: string;
}

const Modal = styled.div`
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
`;

const ModalContent = styled.div`
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 20%;
`;

interface CloseButtonProps {
  type: string;
  onClick: () => void;
  children: ReactNode;
}

const CloseButton = styled.button<CloseButtonProps>`
  float: right;
`;

interface FormProps {
  onSubmit: (event: React.SyntheticEvent) => void;
  children: ReactNode;
}

const StyledForm = styled.form<FormProps>`
  display: flex;
  flex-direction: column;
  margin: 0.5rem;

  label {
    margin: 0.3rem;
    display: flex;
    flex-direction: column;
  }

  input {
    margin: 0.3rem 0;
  }
`;

const Header = styled.p`
  padding: 0.4rem;
  font-size: 1.2rem;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: right;

  button {
    margin-left: 0.3rem;
  }
`;

export function CreateOrEditLogEntryModal({
  handleClose,
  handleCreateOrUpdate,
  currentLogEntry,
}: CreateOrEditLogEntryProps) {
  const logEntryProps: LogEntryFormProps = currentLogEntry ? {...currentLogEntry, logValue: currentLogEntry.logValue.toString(), logDate: new Date(currentLogEntry.logDate).toISOString().split("T")[0]} : { logDate: '', logValue: '' };
  const [logEntry, setLogEntry] = useState<LogEntryFormProps>(logEntryProps);

  function handleSubmitForm(event: React.SyntheticEvent) {
    event.preventDefault();
    const logEntryRequest = {
      ...logEntry,
      logDate: new Date(logEntry.logDate),
      logValue: parseInt(logEntry.logValue, 10)
    }
    handleCreateOrUpdate(logEntryRequest);

  }

  return (<>
    {
      logEntry && 
      <Modal>
        <ModalContent>
          <CloseButton type="button" onClick={handleClose}>
            X
          </CloseButton>
          <Header>{currentLogEntry ? 'Edit' : 'Create'} Log Entry</Header>
          <StyledForm
            onSubmit={handleSubmitForm}
          >
            <label htmlFor="logDate">
              Date:&nbsp;
              <input type="date" name="logDate" value={logEntry.logDate.toString()} onChange={(e) => setLogEntry({...logEntry, logDate: e.target.value})} />
            </label>

            <label htmlFor="logValue">
              Value:&nbsp;
              <input type="text" name="logValue" value={logEntry.logValue} onChange={(e) => setLogEntry({...logEntry, logValue: e.target.value})} />
            </label>
            <ButtonContainer>
              <button type="button" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit">Save</button>
            </ButtonContainer>
          </StyledForm>
        </ModalContent>
      </Modal>
    }
  </>);
}
