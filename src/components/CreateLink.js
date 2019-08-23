import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { FEED_QUERY } from "./LinkList";
import { LINKS_PER_PAGE } from "../constants";

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

function CreateLink({ history }) {
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  const [postMutation] = useMutation(POST_MUTATION);

  const createLink = async () => {
    await postMutation({
      variables: { description, url },
      update: (store, { data: { post } }) => {
        const first = LINKS_PER_PAGE;
        const skip = 0;
        const orderBy = "createdAt_DESC";
        const data = store.readQuery({
          query: FEED_QUERY,
          variables: { first, skip, orderBy },
        });
        data.feed.links.unshift(post);
        store.writeQuery({
          query: FEED_QUERY,
          data,
          variables: { first, skip, orderBy },
        });
      },
    });

    history.push("/new/1");
  };

  return (
    <div>
      <div className="flex flex-column mt3">
        <input
          className="mb2"
          value={description}
          onChange={e => setDescription(e.target.value)}
          type="text"
          placeholder="A description for the link"
        />
        <input
          className="mb2"
          value={url}
          onChange={e => setUrl(e.target.value)}
          type="text"
          placeholder="The URL for the link"
        />
      </div>
      <button onClick={createLink}>Submit</button>
    </div>
  );
}

export default CreateLink;
