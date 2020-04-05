import React from 'react';
import { shallow } from 'enzyme';
import AnnotatorHome from './AnnotatorHome';


describe('AnnotatorHome 테스트 시작', () => {
  let wrapper = null;

  it('렌더링된 스냅샷이 기존과 일치해야 한다.', () => {
    wrapper = shallow(<AnnotatorHome />);
    expect(wrapper).toMatchSnapshot();
  });

  it('렌더링된 메인 타이틀이 있어야 한다.', () => {
    expect(wrapper.find('h1').exists()).toBe(true);
  });
});