import annotator, * as annotatorActions from './annotator';


describe('annotator 테스트 시작', () => {
        const svgNS = 'http://www.w3.org/2000/svg';
        let svgImage = document.createElementNS(svgNS, 'image');

        describe('actions', () => {
                it('액션 생성 함수의 파라미터가 잘 전달되어야 한다.', () => {
                        const expectedActions = [
                                { type: 'annotator/VIEW_IMAGE', url: 'http://sample.png', title: 'Lorem ipsum' }
                                , { type: 'annotator/CHANGE_MODE', mode: 'LABEL_SELECT_MODE' }
                                , { type: 'annotator/SELECT_LABELS', selectedLabelsIds: [] }
                                , { type: 'annotator/CREATE_LABELS', labels: [] }
                                , { type: 'annotator/UPDATE_LABELS', labels: [], selectedLabelsIds: [] }
                                , { type: 'annotator/UPDATE_IMG_LABELS', image: svgImage, labels: [], selectedLabelsIds: [] }
                                , { type: 'annotator/DELETE_LABELS', selectedLabelsIds: [] }
                        ];
                        const actions = [
                                annotatorActions.viewImage('http://sample.png', 'Lorem ipsum')
                                , annotatorActions.changeMode('LABEL_SELECT_MODE')
                                , annotatorActions.selectLabels([])
                                , annotatorActions.createLabels([])
                                , annotatorActions.updateLabels([], [])
                                , annotatorActions.updateImgLabels(svgImage, [], [])
                                , annotatorActions.deleteLabels([])
                        ];
                        expect(actions).toEqual(expectedActions);
                });
        });
        describe('reducer', () => {
                let state = annotator(undefined, {});
                it('store의 초기 상태값이 잘 생성되어야 한다.', () => {
                        expect(state).toEqual({
                                mode: 'LABEL_SELECT_MODE'
                                ,currentImgURL: ''
                                ,images: {}
                                ,labels: {}
                                ,selectedLabelsIds: []
                        });
                });
                it('viewImage가 제대로 수행되어야 한다.', () => {
                        state = annotator(state, annotatorActions.viewImage('http://sample.png', 'Lorem ipsum'));
                        expect(state).toHaveProperty('currentImgURL', 'http://sample.png');
                        expect(state).toHaveProperty('images', { 'http://sample.png': { title: 'Lorem ipsum', x: 0, y: 0, scale: 1 } });
                });
                it('changeMode가 제대로 수행되어야 한다.', () => {
                        state = annotator(state, annotatorActions.changeMode('LABEL_CREATE_MODE'));
                        expect(state).toHaveProperty('mode', 'LABEL_CREATE_MODE');
                        expect(state).toHaveProperty('selectedLabelsIds', []);
                });
                it('selectLabels가 제대로 수행되어야 한다.', () => {
                        state = annotator(state, annotatorActions.selectLabels([0, 1, 3]));
                        expect(state).toHaveProperty('selectedLabelsIds', [0, 1, 3]);
                });
                it('createLabels가 제대로 수행되어야 한다.', () => {
                        let label = document.createElementNS(svgNS, "g");
                        label.setAttribute('transform', 'translate(10 20) scale(1) rotate(0 0 0)');
                        label.classList.add('label');
                        label.dataset.id = '0';
                        label.dataset.name = 'sea';
                        let labelBody = document.createElementNS(svgNS, "rect");
                        labelBody.setAttribute('width', '100');
                        labelBody.setAttribute('height', '50');
                        label.appendChild(labelBody);

                        let _coordinates = [{ x: 10, y: 20 }, { x: 110, y: 20 }, { x: 110, y: 70 }, { x: 10, y: 70 }];
                        let _data = {x: 10, y: 20, w: 100, h: 50, deg: 0};

                        state = annotator(state, annotatorActions.createLabels([label]));
                        expect(state).toHaveProperty('labels', { 'http://sample.png': [{ id: 0, name: 'sea', coordinates: _coordinates, data: _data }] });
                });
                it('updateLabels가 제대로 수행되어야 한다.', () => {
                        let label = document.createElementNS(svgNS, "g");
                        label.setAttribute('transform', 'translate(10 20) scale(1) rotate(0 0 0)');
                        label.classList.add('label');
                        label.dataset.id = '0';
                        label.dataset.name = 'woods';
                        let labelBody = document.createElementNS(svgNS, "rect");
                        labelBody.setAttribute('width', '100');
                        labelBody.setAttribute('height', '50');
                        label.appendChild(labelBody);
                        let selectedLabelsIds = [0];

                        let _coordinates = [{ x: 10, y: 20 }, { x: 110, y: 20 }, { x: 110, y: 70 }, { x: 10, y: 70 }];
                        let _data = {x: 10, y: 20, w: 100, h: 50, deg: 0};

                        state = annotator(state, annotatorActions.updateLabels([label], selectedLabelsIds));
                        expect(state).toHaveProperty('labels', { 'http://sample.png': [{ id: 0, name: 'woods', coordinates: _coordinates, data: _data }] });
                        expect(state).toHaveProperty('selectedLabelsIds', [0]);
                });
                it('updateImgLabels가 제대로 수행되어야 한다.', () => {
                        let image = document.createElementNS(svgNS, 'image');
                        image.setAttribute('transform', 'translate(150 300) scale(1)');
                        let label = document.createElementNS(svgNS, "g");
                        label.setAttribute('transform', 'translate(30 30) scale(1) rotate(0 0 0)');
                        label.classList.add('label');
                        label.dataset.id = '0';
                        label.dataset.name = 'sun';
                        let labelBody = document.createElementNS(svgNS, "rect");
                        labelBody.setAttribute('width', '150');
                        labelBody.setAttribute('height', '150');
                        label.appendChild(labelBody);

                        let _coordinates = [{ x: 30, y: 30 }, { x: 180, y: 30 }, { x: 180, y: 180 }, { x: 30, y: 180 }]
                        let _data = {x: 30, y: 30, w: 150, h: 150, deg: 0};

                        state = annotator(state, annotatorActions.updateImgLabels(image, [label], [0, 1, 3]));
                        expect(state).toHaveProperty('images', { 'http://sample.png': { title: 'Lorem ipsum', x: 150, y: 300, scale: 1 } });
                        expect(state).toHaveProperty('labels', { 'http://sample.png': [{ id: 0, name: 'sun', coordinates: _coordinates, data: _data }] });
                        expect(state).toHaveProperty('selectedLabelsIds', [0, 1, 3]);
                });
                it('deleteLabels가 제대로 수행되어야 한다.', () => {
                        state = annotator(state, annotatorActions.deleteLabels([0]));
                        expect(state).toHaveProperty('labels', { 'http://sample.png': [] });
                });
        })
});
