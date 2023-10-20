import { useQuery } from "@apollo/client";
import {
  FIND_AVAILABLE_MEMBERS,
  FIND_CHAT_HISTORY,
} from "@eden/package-graphql";
import { ChatExternalApp, MemberData } from "@eden/package-graphql/generated";
import { AppUserLayout, Button } from "@eden/package-ui";
import React, { useMemo, useState } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

import { NextPageWithLayout } from "../../_app";

const ChatHistory: NextPageWithLayout = () => {
  const [selectedMember, setSelectedMember] = useState<MemberData>();
  const [search, setSearch] = useState<string>("");
  const [members, setMembers] = useState<MemberData[]>([]);
  const [chatExternalAppData, setChatExternalAppData] = useState<
    ChatExternalApp[]
  >([]);

  const { data: memberData, loading: memberDataIsLoading } = useQuery(
    FIND_AVAILABLE_MEMBERS,
    {
      variables: {
        fields: {
          _id: null,
        },
      },
      ssr: false,
      onCompleted: (data: any) => {
        const filteredMembers = data.findMembers.filter((member: MemberData) =>
          member.discordName?.toLowerCase().includes(search)
        );

        setMembers(filteredMembers);
      },
    }
  );

  const {} = useQuery(FIND_CHAT_HISTORY, {
    variables: {
      fields: {
        userID: selectedMember?._id,
        communicationAuthorType: "USER",
        lastNumMessages: 100,
      },
    },
    ssr: false,
    onCompleted: (data: any) => {
      console.log(data);
      setChatExternalAppData(data?.findLastNumMessagesChatExternalApp);
    },
  });

  const handleMemberClick = (member: MemberData) => {
    setSelectedMember(member);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase());
  };

  useMemo(() => {
    const filteredMembers = memberData?.findMembers?.filter(
      (member: MemberData) => member.discordName?.toLowerCase().includes(search)
    );

    setMembers(filteredMembers);
  }, [search, memberData]);

  return (
    <>
      <div className="flex h-screen flex-row justify-around gap-5 overflow-hidden p-10">
        <div className="flex h-screen flex-col justify-around gap-2">
          <input
            className="h-10 w-80 rounded-md border-2 p-2"
            placeholder="Search for the users..."
            onChange={(e) => handleInputChange(e)}
          ></input>
          <div className="scrollbar-hide mb-10 mt-5 flex h-[calc(100%-150px)] w-96 flex-col overflow-y-auto pb-20">
            {!memberDataIsLoading &&
              members.length > 0 &&
              members.map((member: MemberData) => (
                <Button
                  key={member._id}
                  onClick={() => handleMemberClick(member)}
                  className="mt-1"
                  variant="primary"
                >
                  {member.discordName}
                </Button>
              ))}
          </div>
        </div>
        <div className="border-edenGray-100 mr-20 flex w-[640px] flex-col rounded-md border">
          <section className="border-edenGray-100 flex h-[2.75rem] items-center border-b">
            <h3 className="text-edenGreen-600 w-full text-center">
              Interview with Eden AI
            </h3>
          </section>
          <section className="scrollbar-hide border-edenGray-100 transition-height overflow-y-scroll border-b ease-in-out">
            <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-hide scrolling-touch flex h-full flex-col px-6 py-4">
              <div className="">
                {chatExternalAppData && chatExternalAppData.length ? (
                  <>
                    {chatExternalAppData.map((chat: ChatExternalApp) => (
                      <div className="chat-message mb-4" key={chat._id}>
                        <div
                          className={classNames(
                            chat.senderRole === "assistant"
                              ? ""
                              : "justify-end",
                            "flex items-start"
                          )}
                        >
                          <div
                            className={classNames(
                              chat.senderRole === "assistant"
                                ? "order-2"
                                : "order-1",
                              "mx-2 flex max-w-[78%] flex-col items-start space-y-2 text-xs"
                            )}
                          >
                            <div className="relative">
                              <div>
                                {chat.senderRole !== "assistant" && (
                                  <>
                                    <span className="text-edenGray-700 float-right text-xs font-semibold">
                                      {selectedMember?.discordName}
                                    </span>
                                  </>
                                )}

                                {chat.senderRole !== "user" && (
                                  <>
                                    <span className="font-Moret text-edenGreen-600 text-sm font-semibold">
                                      Eden
                                    </span>
                                  </>
                                )}
                              </div>

                              <span
                                className={classNames(
                                  chat.senderRole === "assistant"
                                    ? "bg-edenPink-300"
                                    : "bg-edenGray-100",
                                  "inline-block whitespace-pre-wrap rounded-lg p-4 text-xs"
                                )}
                              >
                                {chat.message}
                              </span>
                              <div
                                className={classNames(
                                  "absolute bottom-2 h-4 w-4 -rotate-45 rounded-sm",
                                  chat.senderRole === "assistant"
                                    ? "bg-edenPink-300 -left-[0.3rem]"
                                    : "bg-edenGray-100 -right-[0.3rem]"
                                )}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

ChatHistory.getLayout = (page: any) => <AppUserLayout>{page}</AppUserLayout>;

export default ChatHistory;
