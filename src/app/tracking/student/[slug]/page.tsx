import {getChartLabelList, getGradeList} from "@/app/actions/tracking";
import Card from "@/components/Card";
import DoughnutChart from "@/components/Chart/Doughnut";
import StackedBarChart from "@/components/Chart/Stacked";
import Avatar from "@mui/material/Avatar";

export default async function Page() {
    const labelList = await getChartLabelList();
    const gradeList = await getGradeList();

    return (
        <>
            <div className="pt-20 w-full flex gap-x-10 justify-between items-center">
                {/* Student Info */}
                <Card
                    width={30}
                    height={20}
                    paddingX="px-0"
                    paddingY="py-0"
                    flex
                >
                    <div className="bg-[#92cdfa] h-[30%] rounded-t-2xl"></div>
                    <div className="w-full h-full flex flex-col px-4 items-center justify-center">
                        <div className="w-full">
                            <div className="w-full grid grid-cols-[2fr_1fr] place-items-center">
                                <div className="grid grid-cols-[1fr_auto_1fr] gap-x-2 gap-y-4 text-start font-bold text-lg text-[#060b0f]">
                                    <span>Student Code</span>
                                    <span>:</span>
                                    <span>ST0001</span>
                                    <span>Student Name</span>
                                    <span>:</span>
                                    <span>Minh Tran Binh</span>
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
                </Card>
                <DoughnutChart text="1200" />
                <Card width={48} height={20} backgroundColor="#ffffff">
                    <ul className="w-full h-full grid grid-cols-2 gap-y-4 place-content-center place-items-center">
                        {labelList
                            ? labelList.map(label => (
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
                </Card>
            </div>

            <StackedBarChart
                labels={gradeList ? gradeList.map(x => x.name) : []}
            />
        </>
    );
}
