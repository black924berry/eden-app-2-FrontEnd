import { useQuery } from "@apollo/client";
import { FIND_MEMBER } from "@eden/package-graphql";
import {
  SummaryQuestionType,
  TalentListType,
} from "@eden/package-graphql/generated";
import {
  AI_INTERVIEW_SERVICES,
  AskEdenPopUp,
  Avatar,
  Button,
  CandidateTypeSkillMatch,
  EdenAiLetter,
  EdenChatTab,
  GraphTab,
  InfoTab,
  LongText,
  MatchTab,
  MeetingNotes,
  ReportNotes,
} from "@eden/package-ui";
import { Tab } from "@headlessui/react";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

type NodeDisplay = {
  nameRelevantNode: string;
  nameOriginalNode: string;
  score: number;
  color: string;
};

type relevantNodeObj = {
  [key: string]: {
    nodes: NodeDisplay[];
  };
};

export interface ICandidateInfoProps {
  memberID: string;
  percentage?: number | null;
  summaryQuestions?: SummaryQuestionType[];
  mostRelevantMemberNode?: relevantNodeObj;
  candidate?: CandidateTypeSkillMatch;
  onClose?: () => void;
  // eslint-disable-next-line no-unused-vars
  rejectCandidateFn?: (memberID: string) => void;
  // eslint-disable-next-line no-unused-vars
  approveCandidateFn?: (memberID: string) => void;
  qualified?: boolean;
  handleCreateNewList?: () => void;
  talentListsAvailables?: TalentListType[];
  // eslint-disable-next-line no-unused-vars
  handleAddCandidatesToList?: (listID: string) => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  handleChkSelection?: (candidate: any) => void;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export const CandidateInfo = ({
  memberID,
  summaryQuestions,
  mostRelevantMemberNode,
  candidate,
  onClose,
  // rejectCandidateFn,
  // approveCandidateFn,
  // handleChkSelection,
  // talentListsAvailables,
  // handleCreateNewList,
  // handleAddCandidatesToList,
  // eslint-disable-next-line no-unused-vars
  qualified = false,
}: ICandidateInfoProps) => {
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const [letterType, setLetterType] =
    useState<"rejection" | "nextInterviewInvite" | undefined>(undefined);

  const handleRejectionLetter = () => {
    setLetterType("rejection");
    setIsOpen(true);
  };

  const handleSecondInterviewLetter = () => {
    setLetterType("nextInterviewInvite");
    setIsOpen(true);
  };

  const { data: dataMember } = useQuery(FIND_MEMBER, {
    variables: {
      fields: {
        _id: memberID,
      },
    },
    skip: !Boolean(memberID),
    ssr: false,
  });

  const tabs = [
    {
      tab: "Background",
      Content: () => (
        <InfoTab
          member={
            {
              ...candidate,
              user: dataMember?.findMember,
            } as CandidateTypeSkillMatch
          }
          mostRelevantMemberNode={mostRelevantMemberNode}
          candidate={candidate}
        />
      ),
    },
    {
      tab: "Fit",
      Content: () => (
        <ReportNotes
          member={
            {
              ...candidate,
              user: dataMember?.findMember,
            } as CandidateTypeSkillMatch
          }
          candidate={candidate}
        />
      ),
    },
    {
      tab: "Interview",
      Content: () => (
        <MatchTab
          member={
            {
              ...candidate,
              user: dataMember?.findMember,
            } as CandidateTypeSkillMatch
          }
          summaryQuestions={summaryQuestions}
        />
      ),
    },
    {
      tab: "Skill Match",
      Content: () => (
        <GraphTab
          member={
            {
              ...candidate,
              user: dataMember?.findMember,
            } as CandidateTypeSkillMatch
          }
          candidate={candidate}
        />
      ),
    },
    {
      tab: "Culture Fit",
      Content: () => (
        <MeetingNotes member={dataMember?.findMember} candidate={candidate} />
      ),
    },
    {
      tab: "Transcript",
      Content: () => (
        <EdenChatTab
          member={dataMember?.findMember}
          memberImg={dataMember?.findMember.discordAvatar}
          conversationID={candidate?.conversationID || undefined}
        />
      ),
    },
  ];

  // const handleRejectCandidate = () => {
  //   rejectCandidateFn && rejectCandidateFn(memberID);
  // };

  // const handleApproveCandidate = () => {
  //   approveCandidateFn && approveCandidateFn(memberID);
  // };

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-scroll overscroll-y-contain	scrollbar-hide bg-white">
        <section className="w-full flex-col">
          <div
            onClick={onClose}
            className="bg-edenGreen-100 hover:bg-edenGreen-200 absolute right-10 top-9 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md"
          >
            <IoClose color="#19563F" size={"1rem"} />
          </div>

          {/* ---- Header ---- */}
          <div>
            <div className="mb-6 flex p-8 pb-4">
              <div className="mr-3">
                <Avatar
                  src={dataMember?.findMember.discordAvatar!}
                  size={`md`}
                />
              </div>
              <div className="w-full">
                <h3 className="font-Unica text-edenGreen-600">
                  {dataMember?.findMember?.discordName}
                </h3>
                <div>
                  <p className="text-edenGray-700 text-xs">
                    <span>{dataMember?.findMember?.location}</span>
                    {dataMember?.findMember?.timeZone && " | "}
                    <span>{dataMember?.findMember?.timeZone}</span>
                  </p>
                </div>
                <div>
                  {dataMember?.findMember?.oneLiner ? (
                    <p className="text-edenGray-900 w-full whitespace-pre-wrap text-sm">
                      {dataMember?.findMember?.oneLiner}
                    </p>
                  ) : (
                    <LongText
                      cutText={80}
                      text={(dataMember?.findMember?.bio as string) || ""}
                      className={`text-edenGray-900 w-full whitespace-pre-wrap text-sm`}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="pb-20">
          {/* @TODO memoize tab group */}
          <Tab.Group
            defaultIndex={index}
            onChange={(index: number) => {
              // console.log("Changed selected tab to:", index);
              setIndex(index);
            }}
          >
            <Tab.List className="border-edenGreen-300 flex h-8 w-full justify-between border-b">
              {tabs.map(({ tab }, index) => (
                <Tab
                  key={index}
                  className={({ selected }) =>
                    classNames(
                      "text-edenGreen-400 -mb-px w-full pb-2 text-xs",
                      selected
                        ? " !text-edenGreen-600 border-edenGreen-600 border-b outline-none"
                        : "hover:text-edenGreen-500 hover:border-edenGreen-600 hover:border-b"
                    )
                  }
                >
                  {tab.toUpperCase()}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              <div className="">
                {tabs.map(({ Content }, index) => (
                  <Tab.Panel key={index}>
                    <div className="px-8 py-4">
                      <Content />
                    </div>
                  </Tab.Panel>
                ))}
              </div>
            </Tab.Panels>
          </Tab.Group>
        </section>
      </div>
      {dataMember?.findMember && (
        <section className="absolute bottom-0 right-0 h-20 w-full bg-white border-t-2 border-edenGray-100 flex items-center px-4 gap-4">
          {/* ------- schedule 2nd interview button ------- */}
          <Button variant="secondary" onClick={handleSecondInterviewLetter}>
            Schedule 2nd interview
          </Button>

          {/* ------- schedule 2nd interview button ------- */}
          <Button
            variant="tertiary"
            className="bg-utilityRed text-utilityRed bg-opacity-10 hover:bg-opacity-100 hover:bg-utilityRed hover:text-white"
            onClick={handleRejectionLetter}
            // onClick={handleRejectCandidate}
          >
            Reject candidate
          </Button>

          {/* ask eden chat */}
          {dataMember?.findMember && (
            <AskEdenPopUp
              memberID={dataMember?.findMember._id}
              service={AI_INTERVIEW_SERVICES.ASK_EDEN_USER_POSITION}
            />
          )}
        </section>
      )}

      {isOpen && (
        <EdenAiLetter
          member={dataMember?.findMember}
          isModalOpen={isOpen}
          letterType={letterType}
          onClose={() => {
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
};
