import React from "react";
import { shallow } from "enzyme";
import AnnotatorAnnotatingLabel from "../src/components/content-title/ContentTitle";

describe("AnnotatorAnnotatingLabel 테스트 시작", () => {
  let wrapper: any = null;
  const title = "Lorem ipsum";

  it("렌더링된 스냅샷이 기존과 일치해야 한다.", () => {
    // title 프로퍼티 전달
    wrapper = shallow(<AnnotatorAnnotatingLabel title={title} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("전달한 타이틀이 잘 출력되어야 한다.", () => {
    expect(wrapper.find(".viewer-title").text()).toEqual(title);
  });
});
