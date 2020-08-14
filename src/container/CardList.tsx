import CardList from '../components/CardList';
import { connect } from 'react-redux';
import { viewImage } from '../modules/annotator';
import { push } from 'connected-react-router';

const mapDispatchToProps = (dispatch: any) => {
    return {
        viewImage:(url: string, title: string) => {
            dispatch(viewImage(url, title));
            dispatch(push('/view'));
        }
    };
};

export default connect(null, mapDispatchToProps)(CardList);