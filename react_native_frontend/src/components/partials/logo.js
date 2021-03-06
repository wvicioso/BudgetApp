import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { getStyleFromProps } from '../../utils';

export default class Logo extends Component {
  render() {
    const style = [
      logoStyle.imageContainer,
      getStyleFromProps(['marginTop'], this.props),
    ];
    return (
      <View style={style}>
        <Text style={{ fontWeight: '100', fontSize: 100, fontFamily: 'OpenSans', color: '#ffc107' }}>Scale</Text>
      </View>
    );
  }
}

Logo.propTypes = {
  marginTop: PropTypes.number,
};

const logoStyle = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  image: {
    flexGrow: 1,
    width: 110,
    height: 110,
  },
});
