import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import useSWR from "swr";
import isURL from "validator/lib/isURL";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { registerNewURL } from "../../services/url-watcher";

export default function (props: RouteComponentProps) {
  const [url, setUrl] = useState("");
  const [submitRequestInFlight, setSubmitRequestInFlight] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data, error } = useSWR(shouldFetch ? url : null, (url) =>
    registerNewURL({ url })
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitRequestInFlight(true);
    if (validURL(url)) {
      setShouldFetch(true);
    } else {
      setSubmitRequestInFlight(false);
      console.error("failed to post, not a valid URL");
    }
    // TODO: call the register API
  }

  function handleInputChange(event: React.FormEvent<HTMLInputElement>) {
    setUrl(event.currentTarget.value);
  }

  function validURL(url: string) {
    return isURL(url);
  }

  const disableSubmitBtn = !url || !validURL(url) || submitRequestInFlight;

  useEffect(() => {
    if (submitRequestInFlight && data?.status === 200) {
      props.history.push("/new-url-watcher/success");
    }
  }, [props.history, submitRequestInFlight, data]);

  return (
    <>
      <h1 className="text-2xl mb-6">Create a new watched URL</h1>
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
              {url && !validURL(url) && (
                <p className="mr-3 text-red-600 transition-all">Invalid URL</p>
              )}
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
