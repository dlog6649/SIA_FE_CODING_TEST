import React from 'react';
import { render, fireEvent, waitForElement } from "@testing-library/react";
import CardList from './CardList';


describe('CardList 테스트 시작', () => {
  let wrapper: any = null;
  const mockViewImage = jest.fn();
  jest.setTimeout(30000);

  it('렌더링된 스냅샷이 기존과 일치해야 한다. 그리고 썸네일을 클릭 시 해당 정보가 디스패치돼야 한다.', async () => {
    wrapper = render(<CardList viewImage={mockViewImage} />);

    // jsonplaceholder 비동기 대기시간으로 30초 부여
    await waitForElement(() => wrapper.getAllByTestId('testThumbnail'), {timeout: 30000})
      .then(() => {
        expect(wrapper.baseElement).toMatchSnapshot();
        
        let testThumbnails = wrapper.getAllByTestId('testThumbnail');
        expect(testThumbnails.length).toBe(8);
        
        // 0번 썸네일 클릭
        fireEvent.click(testThumbnails[0]);

        let viewImageEventByClick = mockViewImage.mock.calls[0];
        let [url, title] = viewImageEventByClick;
        expect(url).toEqual('https://via.placeholder.com/600/92c952');
        expect(title).toEqual('accusamus beatae ad facilis cum similique qui sunt');
      })
      .catch(err => console.log(err));
  });
});
