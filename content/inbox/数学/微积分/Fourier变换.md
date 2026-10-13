标签：[[微积分]] [[数学]] [[inbox/数学/微积分/Fourier级数]] [[公式]]

# 傅立叶积分

对于在整个实数轴上不具有周期性的函数，傅里叶积分将周期 $T$ 推向无穷大（$T \to \infty$），把离散的频率谱转化为连续的频率谱，从而用连续频率的正弦波积分（积分求和 $\int$）来表达非周期函数。

如果非周期函数 $f(x)$ 在 $(-\infty, +\infty)$ 上满足绝对可积条件 $\int_{-\infty}^{+\infty} \vert{}f(x)\vert{} \, dx < \infty$ 并且满足狄利克雷条件，则 $f(x)$ 可以表示为傅里叶积分。

实数情况可以表达为：
$$
f(x) = \frac{1}{\pi} \int_{0}^{+\infty} \left[ A(\omega) \cos(\omega x) + B(\omega) \sin(\omega x) \right] d\omega
$$
其中系数函数（频谱密度）定义为：
$$
A(\omega) = \int_{-\infty}^{+\infty} f(t) \cos(\omega t) \, dt
$$
$$
B(\omega) = \int_{-\infty}^{+\infty} f(t) \sin(\omega t) \, dt
$$
利用[[欧拉公式]] $e^{i\theta} = \cos\theta + i\sin\theta$，傅里叶积分可以写成更简洁的形式：
$$
f(x) = \frac{1}{2\pi} \int_{-\infty}^{+\infty} F(\omega) e^{i\omega x} \, d\omega
$$
其中：
$$
F(\omega) = \int_{-\infty}^{+\infty} f(t) e^{-i\omega t} \, dt
$$
# 傅立叶变换
正变换（从时域到频域）：
$$
\hat{f}(\omega) = \int_{-\infty}^{+\infty} f(t) e^{-i\omega t} \, dt
$$
将时域信号$f(t)$与频率为$\omega$的旋转复向量$e^{-i\omega t}$做内积，提取出该频率成分的强度与相位信息$\hat{f}(\omega)$。

逆变换（从频域回到时域）：
$$
f(t) = \frac{1}{2\pi} \int_{-\infty}^{+\infty} \hat{f}(\omega) e^{i\omega t} \, d\omega
$$
将频域中所有频率成分按各自的权重重新累加，还原为原始时域信号 $f(t)$。