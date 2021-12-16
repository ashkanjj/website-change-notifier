import { uniq } from "lodash";
import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import useSWR from "swr";
import isURL from "validator/lib/isURL";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { registerNewURL } from "../../services/url-watcher";

export default function (props: RouteComponentProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitRequestInFlight, setSubmitRequestInFlight] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data, error: registerError } = useSWR(
    shouldFetch ? url : null,
    (url) => registerNewURL({ url })
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitRequestInFlight(true);
    if (validURL(url)) {
      setShouldFetch(true);
      setError(null);
    } else {
      setError("invalid-url"); // reset error

      setSubmitRequestInFlight(false);
      console.error("failed to post, not a valid URL");
    }
  }

  function handleInputChange(event: React.FormEvent<HTMLInputElement>) {
    setUrl(event.currentTarget.value);
  }

  const disableSubmitBtn = submitRequestInFlight;

  useEffect(() => {
    if (submitRequestInFlight && data?.status === 200) {
      setError(null); // reset errors
      props.history.push("/new-url-watcher/success");
    }
  }, [props.history, submitRequestInFlight, data]);

  useEffect(() => {
    if (registerError) {
      console.log("registerError", registerError);
      setError("duplicate-url");
      console.log("setting errors", error);
      setShouldFetch(false);
      setSubmitRequestInFlight(false);
    }
  }, [registerError, setSubmitRequestInFlight, setShouldFetch]);

  console.log("render errors", error);

  return (
    <>
      <h1 className="text-2xl mb-6">Register a new URL</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <Input
            placeholder="URL"
            id="url"
            name="url"
            value={url}
            onChange={handleInputChange}
          />
          <div className="pt-3 text-right">
            <div className="flex justify-end items-center">
              <ShowErrors error={error} />
              <Button submitBtn disabled={disableSubmitBtn}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

function ShowErrors({ error }: { error: string | null }) {
  const shouldShowErrors = error !== null;
  return shouldShowErrors ? (
    <>
      {error === "invalid-url" && (
        <p className="mr-3 text-red-600 transition-all">Invalid URL</p>
      )}
      {error === "duplicate-url" && (
        <p className="mr-3 text-red-600 transition-all">URL already exists</p>
      )}
    </>
  ) : null;
}

function validURL(url: string) {
  return isURL(url);
}
