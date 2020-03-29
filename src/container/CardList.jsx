import CardList from '../components/CardList';
import { connect } from 'react-redux';
import { viewImage } from '../modules/annotator';
import { push } from 'connected-react-router';


const mapDispatchToProps = dispatch => {
    return {
        viewImage:(url, title) => {
            dispatch(viewImage(url, title));
            dispatch(push('/view'));
        }
    };
};


export default connect(null, mapDispatchToProps)(CardList);