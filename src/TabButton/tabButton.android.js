import React, { Component } from 'react';
import {
  TouchableOpacity,
  Animated,
  Easing,
  Image,
  View,
  Text,
} from 'react-native';

import styles from './styles';

import TabAnimations from './TabBarAnimations';

const animationDuration = 400;

const borderInterpolationConfig = {
  inputRange: [0, 1],
  outputRange: [20, 0],
};

const opacityInterpolationConfig = {
  inputRange: [0, 1],
  outputRange: [0.0, 0.7],
};

const viewScaleInterpolationConfig = {
  inputRange: [0, 1],
  outputRange: [0.1, 2],
};

class TabButton extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      rippleValue: new Animated.Value(0),
    };

    this.n = new TabAnimations(this.props.buttonConfiguration.animation);
    this.animationStyle = this.n.getAnimatedStyle();
  }

  onPressedIn = (onPress) => {
    this.n.callAnimations();
    Animated.timing(this.state.rippleValue, {
      toValue: 1,
      duration: animationDuration,
      easing: Easing.bezier(0.0, 0.0, 0.1, 1),
    }).start(() => {
      this.state.rippleValue.setValue(0);
    });
    onPress();
  }

  renderRippleView(buttonConfig) {
    const { rippleValue } = this.state;
    const { activeTintColor } = buttonConfig;
    return (
      <View style={styles.rippleViewContainer}>
        <Animated.View
          style={[
            styles.rippleViewAnimated,
            {
              borderWidth: rippleValue.interpolate(borderInterpolationConfig),
              borderColor: activeTintColor,
              opacity: rippleValue.interpolate(opacityInterpolationConfig),
              transform: [{
                scale: rippleValue.interpolate(viewScaleInterpolationConfig),
              }],
            },
          ]}
        />
      </View>
    );
  }

  renderIconImage = (buttonConfiguration) => {
    const {
      active,
      tabIcon,
      iconStyle,
      activeTintColor,
      inactiveTintColor,
    } = buttonConfiguration;

    if (tabIcon) {
      if (typeof tabIcon === 'function') {
        return React.createElement(tabIcon, { ...buttonConfiguration, ref: 'image_ref' });
      }
      const imageStyle = iconStyle
        ? [styles.iconImage, iconStyle]
        : [styles.iconImage];
      if (active) {
        imageStyle.push({ tintColor: activeTintColor });
      } else {
        imageStyle.push({ tintColor: inactiveTintColor });
      }

      return (
        <Image
          style={imageStyle}
          source={tabIcon}
          resizeMode={'contain'}
        />
      );
    }
    return null;
  }

  renderTitleText = (buttonConfig) => {
    const {
      title,
      active,
      showTitle,
      activeTintColor,
      inactiveTintColor,
      textStyle,
      textActiveStyle,
      textInactiveStyle,
    } = buttonConfig;

    const titleTextStyle = textStyle
      ? [styles.titleText, textStyle]
      : [styles.titleText];

    if (active) {
      if (textActiveStyle) {
        titleTextStyle.push(textActiveStyle);
      }
      if (activeTintColor) {
        titleTextStyle.push({ color: activeTintColor });
      }
    } else {
      if (textInactiveStyle) {
        titleTextStyle.push(textInactiveStyle);
      }
      if (inactiveTintColor) {
        titleTextStyle.push({ color: inactiveTintColor });
      }
    }

    if (showTitle) {
      return (
        <Text
          numberOfLines={2}
          style={titleTextStyle}
        >
          {title}
        </Text>
      );
    }
    return null;
  }

  renderAnimatedButton = (onButtonPress, buttonConfiguration) => {
    const { viewWidth } = this.props;
    return (
      <View style={styles.buttonAndroidContainer}>
        {this.renderRippleView(buttonConfiguration)}
        <Animated.View
          style={[
            styles.iconImageContianer,
            {
              top: 50,
              position: 'absolute',
              left: (viewWidth - 30) / 2,
              ...this.animationStyle,
            },
          ]}
        >
          {this.renderIconImage(buttonConfiguration)}
        </Animated.View>
        <TouchableOpacity
          onPress={() => this.onPressedIn(onButtonPress)}
          style={[
            styles.touchableView,
            styles.touchableAnimatedView,
            {
              width: viewWidth / 1.2,
              left: (viewWidth - (viewWidth / 1.2)) / 2,
            },
          ]}
        >
          <View style={styles.titleContainer}>
            {this.renderTitleText(buttonConfiguration)}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderUnanimatedButton = (onButtonPress, buttonConfiguration) => (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onButtonPress}
        style={styles.touchableView}
      >
        <View style={styles.iconImageContianer}>
          {this.renderIconImage(buttonConfiguration)}
        </View>
        <View style={styles.titleContainer}>
          {this.renderTitleText(buttonConfiguration)}
        </View>
      </TouchableOpacity>
    </View>
  )

  render() {
    const { buttonConfiguration, onPress } = this.props;
    return (
      buttonConfiguration.animated
        ? this.renderAnimatedButton(onPress, buttonConfiguration)
        : this.renderUnanimatedButton(onPress, buttonConfiguration)
    );
  }
}

export default TabButton;
