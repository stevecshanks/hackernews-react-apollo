import React from "react";
import { AUTH_TOKEN } from "../constants";
import { timeDifferenceForDate } from "../utils";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

function Link({ index, link, updateStoreAfterVote }) {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  const [voteMutation] = useMutation(VOTE_MUTATION);

  const addVote = () =>
    voteMutation({
      variables: { linkId: link.id },
      update: (store, { data: { vote } }) =>
        updateStoreAfterVote(store, vote, link.id),
    });

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{index + 1}.</span>
        {authToken && (
          <div className="ml1 gray f11" onClick={addVote}>
            ▲
          </div>
        )}
      </div>
      <div className="ml1">
        <div>
          {link.description} ({link.url})
        </div>
        <div className="f6 lh-copy gray">
          {link.votes.length} votes | by{" "}
          {link.postedBy ? link.postedBy.name : "Unknown"}{" "}
          {timeDifferenceForDate(link.createdAt)}
        </div>
      </div>
    </div>
  );
}

export default Link;
