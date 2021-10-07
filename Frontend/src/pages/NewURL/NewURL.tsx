import React, { useState } from "react";
import isEmail from "validator/lib/isEmail";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function () {
  const [url, setUrl] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: call the register API
  }
  function handleInputChange(event: React.FormEvent<HTMLInputElement>) {
    setUrl(event.currentTarget.value);
  }

  function validURL(url: string) {
    return isEmail(url);
  }

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
                <p className="mr-3 text-red-600 transition-all">
                  Invalid email
                </p>
              )}
              <Button submitBtn disabled={!url || !validURL(url)}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
