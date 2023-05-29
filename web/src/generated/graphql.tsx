import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ChangePasswordInput = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};

export type ChangePasswordResponse = {
  __typename?: 'ChangePasswordResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type CreateManyMeaningsInput = {
  oneField?: InputMaybe<Scalars['String']>;
};

export type CreateManyMeaningsResponse = {
  __typename?: 'CreateManyMeaningsResponse';
  error?: Maybe<FieldError>;
  meanings?: Maybe<Array<Meaning>>;
};

export type CreateManyPronunciationsInput = {
  oneField?: InputMaybe<Scalars['String']>;
};

export type CreateManyPronunciationsResponse = {
  __typename?: 'CreateManyPronunciationsResponse';
  error?: Maybe<FieldError>;
  pronunciations?: Maybe<Array<Pronunciation>>;
};

export type CreateMeaningLinkInput = {
  headword: Scalars['String'];
  id: Scalars['Int'];
};

export type CreateMeaningLinkResponse = {
  __typename?: 'CreateMeaningLinkResponse';
  entryId?: Maybe<Scalars['Int']>;
  errors?: Maybe<Array<FieldError>>;
};

export type CreateOneMeaningInput = {
  definition?: InputMaybe<Scalars['String']>;
  headword?: InputMaybe<Scalars['String']>;
  imageLink?: InputMaybe<Scalars['String']>;
  notes?: InputMaybe<Scalars['String']>;
  usage?: InputMaybe<Scalars['String']>;
};

export type CreateOneMeaningResponse = {
  __typename?: 'CreateOneMeaningResponse';
  errors?: Maybe<Array<FieldError>>;
  meaning?: Maybe<Meaning>;
};

export type CreateOnePronunciationInput = {
  audioLink?: InputMaybe<Scalars['String']>;
  headword?: InputMaybe<Scalars['String']>;
  notes?: InputMaybe<Scalars['String']>;
  transcription?: InputMaybe<Scalars['String']>;
};

export type CreateOnePronunciationResponse = {
  __typename?: 'CreateOnePronunciationResponse';
  errors?: Maybe<Array<FieldError>>;
  pronunciation?: Maybe<Pronunciation>;
};

export type DeleteMeaningLinkInput = {
  entryId: Scalars['Int'];
  meaningId: Scalars['Int'];
};

export type DeleteMeaningLinkResponse = {
  __typename?: 'DeleteMeaningLinkResponse';
  error?: Maybe<NoFieldError>;
  isDeletionSuccessful: Scalars['Boolean'];
};

export type DeleteMeaningResponse = {
  __typename?: 'DeleteMeaningResponse';
  error?: Maybe<NoFieldError>;
  isDeletionComplete: Scalars['Boolean'];
};

export type DeletePronunciationResponse = {
  __typename?: 'DeletePronunciationResponse';
  error?: Maybe<NoFieldError>;
  isDeletionComplete: Scalars['Boolean'];
};

export type Entry = {
  __typename?: 'Entry';
  createdAt: Scalars['String'];
  headword: Scalars['String'];
  id: Scalars['Float'];
  meanings?: Maybe<Array<Maybe<Meaning>>>;
  pronunciations?: Maybe<Array<Maybe<Pronunciation>>>;
  updatedAt: Scalars['String'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type Meaning = {
  __typename?: 'Meaning';
  createdAt: Scalars['String'];
  definition: Scalars['String'];
  entries: Array<Entry>;
  id: Scalars['Float'];
  imageLink: Scalars['String'];
  notes: Scalars['String'];
  updatedAt: Scalars['String'];
  usage: Scalars['String'];
  userId: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: ChangePasswordResponse;
  createManyMeanings: CreateManyMeaningsResponse;
  createManyPronunciations: CreateManyPronunciationsResponse;
  createMeaningLink: CreateMeaningLinkResponse;
  createOneMeaning: CreateOneMeaningResponse;
  createOnePronunciation: CreateOnePronunciationResponse;
  deleteMeaning: DeleteMeaningResponse;
  deleteMeaningLink: DeleteMeaningLinkResponse;
  deletePronunciation: DeletePronunciationResponse;
  forgotPassword: Scalars['Boolean'];
  login: LoginResponse;
  logout: Scalars['Boolean'];
  register: RegisterResponse;
  updateMeaning: UpdateMeaningResponse;
  updatePronunciation: UpdatePronunciationResponse;
};


export type MutationChangePasswordArgs = {
  options: ChangePasswordInput;
};


export type MutationCreateManyMeaningsArgs = {
  options: CreateManyMeaningsInput;
};


export type MutationCreateManyPronunciationsArgs = {
  options: CreateManyPronunciationsInput;
};


export type MutationCreateMeaningLinkArgs = {
  options: CreateMeaningLinkInput;
};


export type MutationCreateOneMeaningArgs = {
  options: CreateOneMeaningInput;
};


export type MutationCreateOnePronunciationArgs = {
  options: CreateOnePronunciationInput;
};


export type MutationDeleteMeaningArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteMeaningLinkArgs = {
  options: DeleteMeaningLinkInput;
};


export type MutationDeletePronunciationArgs = {
  id: Scalars['Int'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: RegisterInput;
};


export type MutationUpdateMeaningArgs = {
  options: UpdateMeaningInput;
};


export type MutationUpdatePronunciationArgs = {
  options: UpdatePronunciationInput;
};

export type NoFieldError = {
  __typename?: 'NoFieldError';
  message: Scalars['String'];
};

export type Pronunciation = {
  __typename?: 'Pronunciation';
  audioLink: Scalars['String'];
  createdAt: Scalars['String'];
  entry: Entry;
  entryId: Scalars['Int'];
  id: Scalars['Float'];
  notes: Scalars['String'];
  transcription: Scalars['String'];
  updatedAt: Scalars['String'];
  userId: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  readManyMeanings: ReadManyMeaningsResponse;
  readManyPronunciations: ReadManyPronunciationsResponse;
  readMeaningIdsForPagination: ReadMeaningIdsForPaginationResponse;
  readOneMeaning: ReadOneMeaningResponse;
  readOnePronunciation: ReadOnePronunciationResponse;
  readPronunciationIdsForPagination: ReadPronunciationIdsForPaginationResponse;
};


export type QueryReadManyMeaningsArgs = {
  options: ReadManyMeaningsInput;
};


export type QueryReadManyPronunciationsArgs = {
  options: ReadManyPronunciationsInput;
};


export type QueryReadMeaningIdsForPaginationArgs = {
  options: ReadMeaningIdsForPaginationInput;
};


export type QueryReadOneMeaningArgs = {
  options: ReadOneMeaningInput;
};


export type QueryReadOnePronunciationArgs = {
  options: ReadOnePronunciationInput;
};


export type QueryReadPronunciationIdsForPaginationArgs = {
  options: ReadPronunciationIdsForPaginationInput;
};

export type ReadManyMeaningsInput = {
  limit: Scalars['Int'];
  pagination?: InputMaybe<ReadManyMeaningsPagination>;
  sorting: ReadManyMeaningsSorting;
};

export type ReadManyMeaningsPagination = {
  cursor: Scalars['String'];
  direction: Scalars['String'];
};

export type ReadManyMeaningsResponse = {
  __typename?: 'ReadManyMeaningsResponse';
  error?: Maybe<NoFieldError>;
  meanings?: Maybe<Array<Meaning>>;
};

export type ReadManyMeaningsSorting = {
  by: Scalars['String'];
  order: Scalars['String'];
};

export type ReadManyPronunciationsInput = {
  limit: Scalars['Int'];
  pagination?: InputMaybe<ReadManyPronunciationsPagination>;
  sorting: ReadManyPronunciationsSorting;
};

export type ReadManyPronunciationsPagination = {
  cursor: Scalars['String'];
  direction: Scalars['String'];
};

export type ReadManyPronunciationsResponse = {
  __typename?: 'ReadManyPronunciationsResponse';
  error?: Maybe<NoFieldError>;
  pronunciations?: Maybe<Array<Pronunciation>>;
};

export type ReadManyPronunciationsSorting = {
  by: Scalars['String'];
  order: Scalars['String'];
};

export type ReadMeaningIdsForPaginationInput = {
  by: Scalars['String'];
};

export type ReadMeaningIdsForPaginationResponse = {
  __typename?: 'ReadMeaningIdsForPaginationResponse';
  by?: Maybe<Scalars['String']>;
  error?: Maybe<NoFieldError>;
  id?: Maybe<Scalars['Int']>;
  newest?: Maybe<Array<Scalars['Int']>>;
  oldest?: Maybe<Array<Scalars['Int']>>;
};

export type ReadOneMeaningInput = {
  id?: InputMaybe<Scalars['Int']>;
  pagination?: InputMaybe<ReadOneMeaningPagination>;
};

export type ReadOneMeaningPagination = {
  by: Scalars['String'];
  cursor: Scalars['String'];
  direction: Scalars['String'];
};

export type ReadOneMeaningResponse = {
  __typename?: 'ReadOneMeaningResponse';
  error?: Maybe<NoFieldError>;
  id?: Maybe<Scalars['Int']>;
  meaning?: Maybe<Meaning>;
};

export type ReadOnePronunciationInput = {
  id?: InputMaybe<Scalars['Int']>;
  pagination?: InputMaybe<ReadOnePronunciationPagination>;
};

export type ReadOnePronunciationPagination = {
  by: Scalars['String'];
  cursor: Scalars['String'];
  direction: Scalars['String'];
};

export type ReadOnePronunciationResponse = {
  __typename?: 'ReadOnePronunciationResponse';
  error?: Maybe<NoFieldError>;
  id?: Maybe<Scalars['Int']>;
  pronunciation?: Maybe<Pronunciation>;
};

export type ReadPronunciationIdsForPaginationInput = {
  by: Scalars['String'];
};

export type ReadPronunciationIdsForPaginationResponse = {
  __typename?: 'ReadPronunciationIdsForPaginationResponse';
  by?: Maybe<Scalars['String']>;
  error?: Maybe<NoFieldError>;
  id?: Maybe<Scalars['Int']>;
  newest?: Maybe<Array<Scalars['Int']>>;
  oldest?: Maybe<Array<Scalars['Int']>>;
};

export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type RegisterResponse = {
  __typename?: 'RegisterResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UpdateMeaningInput = {
  id: Scalars['Int'];
  oldEntryId?: InputMaybe<Scalars['Int']>;
  updatedMeaning: UpdatedEntryMeaning;
};

export type UpdateMeaningResponse = {
  __typename?: 'UpdateMeaningResponse';
  errors?: Maybe<Array<FieldError>>;
  meaning?: Maybe<Meaning>;
};

export type UpdatePronunciationInput = {
  id: Scalars['Int'];
  oldEntryId?: InputMaybe<Scalars['Int']>;
  updatedPronunciation: UpdatedEntryPronunciation;
};

export type UpdatePronunciationResponse = {
  __typename?: 'UpdatePronunciationResponse';
  errors?: Maybe<Array<FieldError>>;
  pronunciation?: Maybe<Pronunciation>;
};

export type UpdatedEntryMeaning = {
  definition?: InputMaybe<Scalars['String']>;
  headword?: InputMaybe<Scalars['String']>;
  imageLink?: InputMaybe<Scalars['String']>;
  notes?: InputMaybe<Scalars['String']>;
  usage?: InputMaybe<Scalars['String']>;
};

export type UpdatedEntryPronunciation = {
  audioLink?: InputMaybe<Scalars['String']>;
  headword?: InputMaybe<Scalars['String']>;
  notes?: InputMaybe<Scalars['String']>;
  transcription?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['Float'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type RegularEntryFragment = { __typename?: 'Entry', id: number, headword: string, createdAt: string, updatedAt: string, meanings?: Array<{ __typename?: 'Meaning', id: number, definition: string, usage: string, imageLink: string, notes: string, userId: number, createdAt: string, updatedAt: string } | null> | null, pronunciations?: Array<{ __typename?: 'Pronunciation', id: number, transcription: string, notes: string, userId: number, createdAt: string, updatedAt: string } | null> | null };

export type RegularFieldErrorFragment = { __typename?: 'FieldError', field: string, message: string };

export type RegularMeaningFragment = { __typename?: 'Meaning', id: number, definition: string, usage: string, imageLink: string, notes: string, userId: number, createdAt: string, updatedAt: string, entries: Array<{ __typename?: 'Entry', id: number, headword: string, createdAt: string, updatedAt: string }> };

export type RegularPronunciationFragment = { __typename?: 'Pronunciation', id: number, transcription: string, audioLink: string, notes: string, userId: number, entryId: number, createdAt: string, updatedAt: string, entry: { __typename?: 'Entry', id: number, headword: string, createdAt: string, updatedAt: string } };

export type RegularUserFragment = { __typename?: 'User', id: number, username: string };

export type ChangePasswordMutationVariables = Exact<{
  options: ChangePasswordInput;
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'ChangePasswordResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string } | null } };

export type CreateManyMeaningsMutationVariables = Exact<{
  options: CreateManyMeaningsInput;
}>;


export type CreateManyMeaningsMutation = { __typename?: 'Mutation', createManyMeanings: { __typename?: 'CreateManyMeaningsResponse', meanings?: Array<{ __typename?: 'Meaning', id: number, definition: string, usage: string, imageLink: string, notes: string, userId: number, createdAt: string, updatedAt: string, entries: Array<{ __typename?: 'Entry', id: number, headword: string, createdAt: string, updatedAt: string }> }> | null, error?: { __typename?: 'FieldError', field: string, message: string } | null } };

export type CreateManyPronunciationsMutationVariables = Exact<{
  options: CreateManyPronunciationsInput;
}>;


export type CreateManyPronunciationsMutation = { __typename?: 'Mutation', createManyPronunciations: { __typename?: 'CreateManyPronunciationsResponse', pronunciations?: Array<{ __typename?: 'Pronunciation', id: number, transcription: string, audioLink: string, notes: string, userId: number, entryId: number, createdAt: string, updatedAt: string, entry: { __typename?: 'Entry', id: number, headword: string, createdAt: string, updatedAt: string } }> | null, error?: { __typename?: 'FieldError', field: string, message: string } | null } };

export type CreateMeaningLinkMutationVariables = Exact<{
  options: CreateMeaningLinkInput;
}>;


export type CreateMeaningLinkMutation = { __typename?: 'Mutation', createMeaningLink: { __typename?: 'CreateMeaningLinkResponse', entryId?: number | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type CreateOneMeaningMutationVariables = Exact<{
  options: CreateOneMeaningInput;
}>;


export type CreateOneMeaningMutation = { __typename?: 'Mutation', createOneMeaning: { __typename?: 'CreateOneMeaningResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, meaning?: { __typename?: 'Meaning', id: number, definition: string, usage: string, imageLink: string, notes: string, userId: number, createdAt: string, updatedAt: string, entries: Array<{ __typename?: 'Entry', id: number, headword: string, createdAt: string, updatedAt: string }> } | null } };

export type CreateOnePronunciationMutationVariables = Exact<{
  options: CreateOnePronunciationInput;
}>;


export type CreateOnePronunciationMutation = { __typename?: 'Mutation', createOnePronunciation: { __typename?: 'CreateOnePronunciationResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, pronunciation?: { __typename?: 'Pronunciation', id: number, transcription: string, audioLink: string, notes: string, userId: number, entryId: number, createdAt: string, updatedAt: string, entry: { __typename?: 'Entry', id: number, headword: string, createdAt: string, updatedAt: string } } | null } };

export type DeleteMeaningMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteMeaningMutation = { __typename?: 'Mutation', deleteMeaning: { __typename?: 'DeleteMeaningResponse', isDeletionComplete: boolean, error?: { __typename?: 'NoFieldError', message: string } | null } };

export type DeleteMeaningLinkMutationVariables = Exact<{
  options: DeleteMeaningLinkInput;
}>;


export type DeleteMeaningLinkMutation = { __typename?: 'Mutation', deleteMeaningLink: { __typename?: 'DeleteMeaningLinkResponse', isDeletionSuccessful: boolean, error?: { __typename?: 'NoFieldError', message: string } | null } };

export type DeletePronunciationMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeletePronunciationMutation = { __typename?: 'Mutation', deletePronunciation: { __typename?: 'DeletePronunciationResponse', isDeletionComplete: boolean, error?: { __typename?: 'NoFieldError', message: string } | null } };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  options: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'RegisterResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string } | null } };

export type UpdateMeaningMutationVariables = Exact<{
  options: UpdateMeaningInput;
}>;


export type UpdateMeaningMutation = { __typename?: 'Mutation', updateMeaning: { __typename?: 'UpdateMeaningResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, meaning?: { __typename?: 'Meaning', id: number, definition: string, usage: string, imageLink: string, notes: string, userId: number, createdAt: string, updatedAt: string } | null } };

export type UpdatePronunciationMutationVariables = Exact<{
  options: UpdatePronunciationInput;
}>;


export type UpdatePronunciationMutation = { __typename?: 'Mutation', updatePronunciation: { __typename?: 'UpdatePronunciationResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, pronunciation?: { __typename?: 'Pronunciation', id: number, transcription: string, notes: string, userId: number, entryId: number, createdAt: string, updatedAt: string } | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, username: string } | null };

export type ReadManyMeaningsQueryVariables = Exact<{
  options: ReadManyMeaningsInput;
}>;


export type ReadManyMeaningsQuery = { __typename?: 'Query', readManyMeanings: { __typename?: 'ReadManyMeaningsResponse', meanings?: Array<{ __typename?: 'Meaning', id: number, definition: string, usage: string, imageLink: string, notes: string, userId: number, createdAt: string, updatedAt: string, entries: Array<{ __typename?: 'Entry', id: number, headword: string, createdAt: string, updatedAt: string }> }> | null, error?: { __typename?: 'NoFieldError', message: string } | null } };

export type ReadManyPronunciationsQueryVariables = Exact<{
  options: ReadManyPronunciationsInput;
}>;


export type ReadManyPronunciationsQuery = { __typename?: 'Query', readManyPronunciations: { __typename?: 'ReadManyPronunciationsResponse', pronunciations?: Array<{ __typename?: 'Pronunciation', id: number, transcription: string, audioLink: string, notes: string, userId: number, entryId: number, createdAt: string, updatedAt: string, entry: { __typename?: 'Entry', id: number, headword: string, createdAt: string, updatedAt: string } }> | null, error?: { __typename?: 'NoFieldError', message: string } | null } };

export type ReadMeaningIdsForPaginationQueryVariables = Exact<{
  options: ReadMeaningIdsForPaginationInput;
}>;


export type ReadMeaningIdsForPaginationQuery = { __typename?: 'Query', readMeaningIdsForPagination: { __typename?: 'ReadMeaningIdsForPaginationResponse', id?: number | null, by?: string | null, oldest?: Array<number> | null, newest?: Array<number> | null, error?: { __typename?: 'NoFieldError', message: string } | null } };

export type ReadOneMeaningQueryVariables = Exact<{
  options: ReadOneMeaningInput;
}>;


export type ReadOneMeaningQuery = { __typename?: 'Query', readOneMeaning: { __typename?: 'ReadOneMeaningResponse', id?: number | null, meaning?: { __typename?: 'Meaning', id: number, definition: string, usage: string, imageLink: string, notes: string, userId: number, createdAt: string, updatedAt: string, entries: Array<{ __typename?: 'Entry', id: number, headword: string, createdAt: string, updatedAt: string }> } | null, error?: { __typename?: 'NoFieldError', message: string } | null } };

export type ReadOnePronunciationQueryVariables = Exact<{
  options: ReadOnePronunciationInput;
}>;


export type ReadOnePronunciationQuery = { __typename?: 'Query', readOnePronunciation: { __typename?: 'ReadOnePronunciationResponse', id?: number | null, pronunciation?: { __typename?: 'Pronunciation', id: number, transcription: string, audioLink: string, notes: string, userId: number, entryId: number, createdAt: string, updatedAt: string, entry: { __typename?: 'Entry', id: number, headword: string, createdAt: string, updatedAt: string } } | null, error?: { __typename?: 'NoFieldError', message: string } | null } };

export type ReadPronunciationIdsForPaginationQueryVariables = Exact<{
  options: ReadPronunciationIdsForPaginationInput;
}>;


export type ReadPronunciationIdsForPaginationQuery = { __typename?: 'Query', readPronunciationIdsForPagination: { __typename?: 'ReadPronunciationIdsForPaginationResponse', id?: number | null, by?: string | null, oldest?: Array<number> | null, newest?: Array<number> | null, error?: { __typename?: 'NoFieldError', message: string } | null } };

export const RegularEntryFragmentDoc = gql`
    fragment RegularEntry on Entry {
  id
  headword
  meanings {
    id
    definition
    usage
    imageLink
    notes
    userId
    createdAt
    updatedAt
  }
  pronunciations {
    id
    transcription
    notes
    userId
    createdAt
    updatedAt
  }
  createdAt
  updatedAt
}
    `;
export const RegularFieldErrorFragmentDoc = gql`
    fragment RegularFieldError on FieldError {
  field
  message
}
    `;
export const RegularMeaningFragmentDoc = gql`
    fragment RegularMeaning on Meaning {
  id
  definition
  usage
  imageLink
  notes
  userId
  entries {
    id
    headword
    createdAt
    updatedAt
  }
  createdAt
  updatedAt
}
    `;
export const RegularPronunciationFragmentDoc = gql`
    fragment RegularPronunciation on Pronunciation {
  id
  transcription
  audioLink
  notes
  userId
  entryId
  entry {
    id
    headword
    createdAt
    updatedAt
  }
  createdAt
  updatedAt
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
}
    `;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($options: ChangePasswordInput!) {
  changePassword(options: $options) {
    errors {
      ...RegularFieldError
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularFieldErrorFragmentDoc}
${RegularUserFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreateManyMeaningsDocument = gql`
    mutation CreateManyMeanings($options: CreateManyMeaningsInput!) {
  createManyMeanings(options: $options) {
    meanings {
      ...RegularMeaning
    }
    error {
      ...RegularFieldError
    }
  }
}
    ${RegularMeaningFragmentDoc}
${RegularFieldErrorFragmentDoc}`;

export function useCreateManyMeaningsMutation() {
  return Urql.useMutation<CreateManyMeaningsMutation, CreateManyMeaningsMutationVariables>(CreateManyMeaningsDocument);
};
export const CreateManyPronunciationsDocument = gql`
    mutation CreateManyPronunciations($options: CreateManyPronunciationsInput!) {
  createManyPronunciations(options: $options) {
    pronunciations {
      ...RegularPronunciation
    }
    error {
      ...RegularFieldError
    }
  }
}
    ${RegularPronunciationFragmentDoc}
${RegularFieldErrorFragmentDoc}`;

export function useCreateManyPronunciationsMutation() {
  return Urql.useMutation<CreateManyPronunciationsMutation, CreateManyPronunciationsMutationVariables>(CreateManyPronunciationsDocument);
};
export const CreateMeaningLinkDocument = gql`
    mutation CreateMeaningLink($options: CreateMeaningLinkInput!) {
  createMeaningLink(options: $options) {
    entryId
    errors {
      ...RegularFieldError
    }
  }
}
    ${RegularFieldErrorFragmentDoc}`;

export function useCreateMeaningLinkMutation() {
  return Urql.useMutation<CreateMeaningLinkMutation, CreateMeaningLinkMutationVariables>(CreateMeaningLinkDocument);
};
export const CreateOneMeaningDocument = gql`
    mutation CreateOneMeaning($options: CreateOneMeaningInput!) {
  createOneMeaning(options: $options) {
    errors {
      ...RegularFieldError
    }
    meaning {
      ...RegularMeaning
    }
  }
}
    ${RegularFieldErrorFragmentDoc}
${RegularMeaningFragmentDoc}`;

export function useCreateOneMeaningMutation() {
  return Urql.useMutation<CreateOneMeaningMutation, CreateOneMeaningMutationVariables>(CreateOneMeaningDocument);
};
export const CreateOnePronunciationDocument = gql`
    mutation CreateOnePronunciation($options: CreateOnePronunciationInput!) {
  createOnePronunciation(options: $options) {
    errors {
      ...RegularFieldError
    }
    pronunciation {
      ...RegularPronunciation
    }
  }
}
    ${RegularFieldErrorFragmentDoc}
${RegularPronunciationFragmentDoc}`;

export function useCreateOnePronunciationMutation() {
  return Urql.useMutation<CreateOnePronunciationMutation, CreateOnePronunciationMutationVariables>(CreateOnePronunciationDocument);
};
export const DeleteMeaningDocument = gql`
    mutation DeleteMeaning($id: Int!) {
  deleteMeaning(id: $id) {
    isDeletionComplete
    error {
      message
    }
  }
}
    `;

export function useDeleteMeaningMutation() {
  return Urql.useMutation<DeleteMeaningMutation, DeleteMeaningMutationVariables>(DeleteMeaningDocument);
};
export const DeleteMeaningLinkDocument = gql`
    mutation DeleteMeaningLink($options: DeleteMeaningLinkInput!) {
  deleteMeaningLink(options: $options) {
    isDeletionSuccessful
    error {
      message
    }
  }
}
    `;

export function useDeleteMeaningLinkMutation() {
  return Urql.useMutation<DeleteMeaningLinkMutation, DeleteMeaningLinkMutationVariables>(DeleteMeaningLinkDocument);
};
export const DeletePronunciationDocument = gql`
    mutation DeletePronunciation($id: Int!) {
  deletePronunciation(id: $id) {
    isDeletionComplete
    error {
      message
    }
  }
}
    `;

export function useDeletePronunciationMutation() {
  return Urql.useMutation<DeletePronunciationMutation, DeletePronunciationMutationVariables>(DeletePronunciationDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    errors {
      ...RegularFieldError
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularFieldErrorFragmentDoc}
${RegularUserFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($options: RegisterInput!) {
  register(options: $options) {
    errors {
      ...RegularFieldError
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularFieldErrorFragmentDoc}
${RegularUserFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const UpdateMeaningDocument = gql`
    mutation UpdateMeaning($options: UpdateMeaningInput!) {
  updateMeaning(options: $options) {
    errors {
      ...RegularFieldError
    }
    meaning {
      id
      definition
      usage
      imageLink
      notes
      userId
      createdAt
      updatedAt
    }
  }
}
    ${RegularFieldErrorFragmentDoc}`;

export function useUpdateMeaningMutation() {
  return Urql.useMutation<UpdateMeaningMutation, UpdateMeaningMutationVariables>(UpdateMeaningDocument);
};
export const UpdatePronunciationDocument = gql`
    mutation UpdatePronunciation($options: UpdatePronunciationInput!) {
  updatePronunciation(options: $options) {
    errors {
      ...RegularFieldError
    }
    pronunciation {
      id
      transcription
      notes
      userId
      entryId
      createdAt
      updatedAt
    }
  }
}
    ${RegularFieldErrorFragmentDoc}`;

export function useUpdatePronunciationMutation() {
  return Urql.useMutation<UpdatePronunciationMutation, UpdatePronunciationMutationVariables>(UpdatePronunciationDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery, MeQueryVariables>({ query: MeDocument, ...options });
};
export const ReadManyMeaningsDocument = gql`
    query ReadManyMeanings($options: ReadManyMeaningsInput!) {
  readManyMeanings(options: $options) {
    meanings {
      ...RegularMeaning
    }
    error {
      message
    }
  }
}
    ${RegularMeaningFragmentDoc}`;

export function useReadManyMeaningsQuery(options: Omit<Urql.UseQueryArgs<ReadManyMeaningsQueryVariables>, 'query'>) {
  return Urql.useQuery<ReadManyMeaningsQuery, ReadManyMeaningsQueryVariables>({ query: ReadManyMeaningsDocument, ...options });
};
export const ReadManyPronunciationsDocument = gql`
    query ReadManyPronunciations($options: ReadManyPronunciationsInput!) {
  readManyPronunciations(options: $options) {
    pronunciations {
      ...RegularPronunciation
    }
    error {
      message
    }
  }
}
    ${RegularPronunciationFragmentDoc}`;

export function useReadManyPronunciationsQuery(options: Omit<Urql.UseQueryArgs<ReadManyPronunciationsQueryVariables>, 'query'>) {
  return Urql.useQuery<ReadManyPronunciationsQuery, ReadManyPronunciationsQueryVariables>({ query: ReadManyPronunciationsDocument, ...options });
};
export const ReadMeaningIdsForPaginationDocument = gql`
    query ReadMeaningIdsForPagination($options: ReadMeaningIdsForPaginationInput!) {
  readMeaningIdsForPagination(options: $options) {
    id
    by
    oldest
    newest
    error {
      message
    }
  }
}
    `;

export function useReadMeaningIdsForPaginationQuery(options: Omit<Urql.UseQueryArgs<ReadMeaningIdsForPaginationQueryVariables>, 'query'>) {
  return Urql.useQuery<ReadMeaningIdsForPaginationQuery, ReadMeaningIdsForPaginationQueryVariables>({ query: ReadMeaningIdsForPaginationDocument, ...options });
};
export const ReadOneMeaningDocument = gql`
    query ReadOneMeaning($options: ReadOneMeaningInput!) {
  readOneMeaning(options: $options) {
    id
    meaning {
      ...RegularMeaning
    }
    error {
      message
    }
  }
}
    ${RegularMeaningFragmentDoc}`;

export function useReadOneMeaningQuery(options: Omit<Urql.UseQueryArgs<ReadOneMeaningQueryVariables>, 'query'>) {
  return Urql.useQuery<ReadOneMeaningQuery, ReadOneMeaningQueryVariables>({ query: ReadOneMeaningDocument, ...options });
};
export const ReadOnePronunciationDocument = gql`
    query ReadOnePronunciation($options: ReadOnePronunciationInput!) {
  readOnePronunciation(options: $options) {
    id
    pronunciation {
      ...RegularPronunciation
    }
    error {
      message
    }
  }
}
    ${RegularPronunciationFragmentDoc}`;

export function useReadOnePronunciationQuery(options: Omit<Urql.UseQueryArgs<ReadOnePronunciationQueryVariables>, 'query'>) {
  return Urql.useQuery<ReadOnePronunciationQuery, ReadOnePronunciationQueryVariables>({ query: ReadOnePronunciationDocument, ...options });
};
export const ReadPronunciationIdsForPaginationDocument = gql`
    query ReadPronunciationIdsForPagination($options: ReadPronunciationIdsForPaginationInput!) {
  readPronunciationIdsForPagination(options: $options) {
    id
    by
    oldest
    newest
    error {
      message
    }
  }
}
    `;

export function useReadPronunciationIdsForPaginationQuery(options: Omit<Urql.UseQueryArgs<ReadPronunciationIdsForPaginationQueryVariables>, 'query'>) {
  return Urql.useQuery<ReadPronunciationIdsForPaginationQuery, ReadPronunciationIdsForPaginationQueryVariables>({ query: ReadPronunciationIdsForPaginationDocument, ...options });
};