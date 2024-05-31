import {getGrades, getHashtags} from "@/app/actions/common";
import {getStudentByCode} from "@/app/actions/student";
import Box from "@/components/Box";
import {type DynamicPageProps} from "@/types";
import Avatar from "@mui/material/Avatar";
import dynamic from "next/dynamic";
import {Suspense} from "react";
const DoughnutChart = dynamic(() => import("@/components/Chart/Doughnut"));
const StackedBarChart = dynamic(() => import("@/components/Chart/Stacked"));

export default async function Page(props: DynamicPageProps) {
    const [labels, grades, studentInfo] = await Promise.all([
        getHashtags(),
        getGrades(),
        getStudentByCode(props.params.slug),
    ]);

    return (
        <>
            <div className="pt-20 w-full flex gap-x-10 justify-between items-center">
                {/* Student Info */}
                <div className="w-1/3 h-full bg-white rounded-2xl">
                    <div className="bg-[#92cdfa] h-[30%] rounded-t-2xl"></div>
                    <div className="w-full h-[70%] flex flex-col px-4">
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-full grid grid-cols-[2fr_1fr] place-items-center">
                                <div className="grid grid-cols-[0.25fr_auto_2fr] gap-x-2 gap-y-2 text-start font-semibold text-lg text-[#060b0f] whitespace-nowrap">
                                    <span>Student Code</span>
                                    <span>:</span>
                                    <span>{studentInfo?.code}</span>
                                    <span>Student Name</span>
                                    <span>:</span>
                                    <span>{studentInfo?.name}</span>
                                </div>
                                <div className="flex justify-center items-center">
                                    <Avatar
                                        sx={{
                                            width: 112,
                                            height: 112,
                                            bgcolor: "#d87579",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Suspense>
                    <DoughnutChart text="90" />
                </Suspense>
                <Box width={48} height={20} backgroundColor="#ffffff">
                    <ul className="w-full h-full grid grid-cols-2 gap-y-4 place-content-center place-items-center">
                        {labels
                            ? labels.map(label => (
                                  <li
                                      key={label.id}
                                      className="w-full text-left flex gap-x-4 items-center"
                                  >
                                      <span
                                          className="w-3 h-3 rounded-full"
                                          style={{backgroundColor: label.color}}
                                      ></span>
                                      {label.name}
                                  </li>
                              ))
                            : null}
                    </ul>
                </Box>
            </div>

            <Suspense>
                <StackedBarChart
                    labels={grades ? grades.map(x => x.name) : []}
                />
            </Suspense>
        </>
    );
}
